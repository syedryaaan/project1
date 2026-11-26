import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const runServerSubprocess = (envOverrides, timeoutMs = 15000) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, ["backend/server"], {
      cwd: rootDir,
      env: {
        PATH: process.env.PATH,
        ...envOverrides,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve({ code: null, stdout, stderr, timedOut: true });
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut: false });
    });
  });

test("fails fast with exit code 1 when MONGO_URI and JWT_SECRET are missing", async () => {
  const result = await runServerSubprocess({
    MONGO_URI: "",
    JWT_SECRET: "",
    NODE_ENV: "production",
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required environment variables: MONGO_URI, JWT_SECRET/
  );
});

test("rejects placeholder credentials in production mode", async () => {
  const result = await runServerSubprocess({
    NODE_ENV: "production",
    MONGO_URI:
      "mongodb+srv://user:<YOUR_DB_PASSWORD>@cluster0.example.mongodb.net/nexastore",
    JWT_SECRET: "<GENERATE_A_LONG_RANDOM_SECRET>",
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Placeholder values detected in production/);
});

test("does not start HTTP listener when MongoDB connection fails", async () => {
  const result = await runServerSubprocess({
    NODE_ENV: "production",
    PORT: "5998",
    MONGO_URI: "mongodb://127.0.0.1:27099/unreachable_nexastore_test",
    JWT_SECRET: "0123456789abcdef0123456789abcdef0123456789abcdef",
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Startup Error: Database connection failed/);
  assert.doesNotMatch(result.stdout, /server running/);
});

test("connectDB validates placeholder and URI scheme in production", async () => {
  const { default: connectDB } = await import("../config/db.js");
  const prevEnv = { ...process.env };

  try {
    process.env.NODE_ENV = "production";
    process.env.MONGO_URI = "mongodb+srv://u:<DB_PASSWORD>@c.mongodb.net/db";
    await assert.rejects(connectDB, /contains placeholder values/);

    process.env.MONGO_URI = "https://not-a-mongo-uri.example.com";
    await assert.rejects(connectDB, /Invalid MONGO_URI format/);
  } finally {
    process.env = prevEnv;
  }
});

test("User pre-save hook hashes password cleanly in Mongoose 9", async () => {
  const { default: User } = await import("../models/userModel.js");
  const user = new User({
    name: "Test User",
    email: "hooktest@example.com",
    password: "password123",
  });

  await User.schema.s.hooks.execPre("save", user, [{}]);

  assert.notEqual(user.password, "password123");
  assert.match(user.password, /^\$2[aby]\$/);
  assert.equal(await user.matchPassword("password123"), true);
  assert.equal(await user.matchPassword("wrongpass"), false);
});

test("generateToken signs JWT with JWT_SECRET", async () => {
  const prevSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test_secret_key_for_jwt_verification_123456";

  try {
    const { default: generateToken } = await import(
      "../utils/generateToken.js"
    );
    const token = generateToken("507f1f77bcf86cd799439011");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    assert.equal(decoded.id, "507f1f77bcf86cd799439011");
  } finally {
    if (prevSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = prevSecret;
    }
  }
});

test("Express production app handles SPA routes, API 404, CORS, trust proxy, health, and auth", async () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevFrontendUrl = process.env.FRONTEND_URL;
  const prevPaypal = process.env.PAYPAL_CLIENT_ID;
  const prevSecret = process.env.JWT_SECRET;

  process.env.NODE_ENV = "production";
  process.env.FRONTEND_URL = "https://allowed-frontend.example.com/";
  process.env.PAYPAL_CLIENT_ID = "test-paypal-id";
  process.env.JWT_SECRET = "test_secret_key_for_jwt_verification_123456";

  const { createApp } = await import("../server.js");
  const app = createApp();

  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Health endpoint reflects disconnected DB with 503
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 503);
    const healthJson = await healthRes.json();
    assert.equal(healthJson.status, "error");
    assert.equal(healthJson.database, "disconnected");

    // 2. PayPal config route
    const paypalRes = await fetch(`${baseUrl}/api/config/paypal`);
    assert.equal(paypalRes.status, 200);
    assert.equal(await paypalRes.text(), "test-paypal-id");

    // 3. CORS allows configured origin (with trailing slash normalized) and blocks untrusted origin
    const allowedCors = await fetch(`${baseUrl}/api/config/paypal`, {
      headers: { Origin: "https://allowed-frontend.example.com" },
    });
    assert.equal(
      allowedCors.headers.get("access-control-allow-origin"),
      "https://allowed-frontend.example.com"
    );

    const blockedCors = await fetch(`${baseUrl}/api/config/paypal`, {
      headers: { Origin: "https://evil.example.com" },
    });
    assert.equal(blockedCors.headers.get("access-control-allow-origin"), null);

    // 4. Reverse proxy X-Forwarded-For works with express-rate-limit (trust proxy = 1)
    const proxyRes = await fetch(`${baseUrl}/api/config/paypal`, {
      headers: { "X-Forwarded-For": "203.0.113.10" },
    });
    assert.equal(proxyRes.status, 200);

    // 5. Missing API route returns 404 JSON (not HTML)
    const missingApiRes = await fetch(`${baseUrl}/api/nonexistent`);
    assert.equal(missingApiRes.status, 404);
    const missingApiJson = await missingApiRes.json();
    assert.match(missingApiJson.message, /Not Found/);

    // 6. Auth middleware rejects unauthenticated and invalid tokens cleanly
    const noAuthRes = await fetch(`${baseUrl}/api/users/profile`);
    assert.equal(noAuthRes.status, 401);

    const badAuthRes = await fetch(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    assert.equal(badAuthRes.status, 401);

    // 7. Upload route without file returns 400 (not 500)
    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
    });
    assert.equal(uploadRes.status, 400);

    // 8. Production SPA route works when frontend/build exists
    const buildIndex = path.join(rootDir, "frontend", "build", "index.html");
    if (fs.existsSync(buildIndex)) {
      const spaRes = await fetch(`${baseUrl}/product/123456`);
      assert.equal(spaRes.status, 200);
      assert.match(spaRes.headers.get("content-type") || "", /text\/html/);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
    if (prevFrontendUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = prevFrontendUrl;
    if (prevPaypal === undefined) delete process.env.PAYPAL_CLIENT_ID;
    else process.env.PAYPAL_CLIENT_ID = prevPaypal;
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  }
});
