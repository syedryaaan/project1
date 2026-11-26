// NexaStore — Express Server
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import "colors";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

// Load .env from repo root when present (local dev); hosted platforms inject process.env directly
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const PLACEHOLDER_MARKERS = [
  "<YOUR_DB_PASSWORD>",
  "<DB_PASSWORD>",
  "<GENERATE_A_LONG_RANDOM_SECRET>",
  "<password>",
  "<username>",
  "<cluster>",
];

/**
 * Validate required environment variables and reject placeholder values in production.
 */
export const validateEnv = () => {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter(
    (v) => !process.env[v] || !process.env[v].trim()
  );
  if (missingEnvVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
        .red.bold
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production") {
    const placeholderVars = requiredEnvVars.filter((v) =>
      PLACEHOLDER_MARKERS.some((marker) => process.env[v].includes(marker))
    );
    if (placeholderVars.length > 0) {
      console.error(
        `❌ Placeholder values detected in production for: ${placeholderVars.join(
          ", "
        )}. Configure real credentials in your hosting environment.`.red.bold
      );
      process.exit(1);
    }

    if (process.env.JWT_SECRET.trim().length < 32) {
      console.warn(
        "⚠️  JWT_SECRET is shorter than 32 characters. Use a stronger random secret in production."
          .yellow
      );
    }
  }

  if (process.env.RENDER === "true" && process.env.NODE_ENV !== "production") {
    console.warn(
      "⚠️  Running on Render without NODE_ENV=production. Set NODE_ENV=production to serve the React build and enable production security defaults."
        .yellow
    );
  }
};

const normalizeOrigin = (url) => url.trim().replace(/\/+$/, "");

/**
 * Create and configure the Express application without side effects on import.
 */
export const createApp = () => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  // Trust single reverse-proxy hop (Render load balancer) so rate limiting & req.ip work accurately
  app.set("trust proxy", 1);

  // ─── Security Middleware ───────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
  if (process.env.RENDER_EXTERNAL_URL) {
    configuredOrigins.push(normalizeOrigin(process.env.RENDER_EXTERNAL_URL));
  }

  const allowedOrigins = isProduction
    ? [...new Set(configuredOrigins)]
    : [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        ...new Set(configuredOrigins),
      ];

  const corsOptions = {
    origin(requestOrigin, callback) {
      // Allow non-browser requests and same-origin requests without an allowed external Origin header
      if (!requestOrigin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(normalizeOrigin(requestOrigin))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Too many authentication attempts, try again later." },
  });

  app.use("/api/", apiLimiter);
  app.use("/api/users/login", authLimiter);
  app.use("/api/users/register", authLimiter);

  // ─── Request Parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Express 5 compatible NoSQL sanitization
  app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
  });

  // ─── Logging ──────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV !== "test") {
    app.use(morgan("short"));
  }

  // ─── Routes ───────────────────────────────────────────────────────────────────
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/upload", uploadRoutes);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({
      status: isConnected ? "ok" : "error",
      database: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });

  // PayPal client id
  app.get("/api/config/paypal", (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID || "sb")
  );

  // Static file serving
  app.use("/uploads", express.static(path.join(rootDir, "uploads")));

  // ─── Production Static ────────────────────────────────────────────────────────
  if (isProduction) {
    const frontendBuildPath = path.join(rootDir, "frontend", "build");
    const indexHtmlPath = path.join(frontendBuildPath, "index.html");

    if (fs.existsSync(indexHtmlPath)) {
      app.use(express.static(frontendBuildPath));
      // Express 5 requires named wildcard splat syntax instead of bare "*"
      app.get("/{*splat}", (req, res, next) => {
        if (req.path === "/api" || req.path.startsWith("/api/")) {
          return next();
        }
        return res.sendFile(indexHtmlPath);
      });
    } else {
      console.warn(
        "⚠️  frontend/build/index.html not found. Run 'npm run build' during deployment to serve the React frontend."
          .yellow
      );
      app.get("/", (req, res) => {
        res.json({
          message: "NexaStore API is running (frontend build not found).",
        });
      });
    }
  } else {
    app.get("/", (req, res) => {
      res.send("NexaStore API is running...");
    });
  }

  // ─── Error Handling ───────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();
let server;
let isShuttingDown = false;

const startServer = async () => {
  const PORT = Number(process.env.PORT) || 5001;
  const mode = process.env.NODE_ENV || "development";

  try {
    // Ensure the server starts AFTER successful database connection
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `🚀 NexaStore server running in ${mode} mode on port ${PORT}`.yellow
          .bold
      );
    });
  } catch (error) {
    console.error(`❌ Startup Error: ${error.message}`.red.underline.bold);
    console.log(
      "💡 Verify MONGO_URI in your environment variables (or .env for local dev) and ensure MongoDB is reachable."
        .cyan
    );
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("\nInitiating graceful shutdown...".yellow);
  const forceExitTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout.".red);
    process.exit(1);
  }, 10000);
  forceExitTimer.unref();

  const closeDbAndExit = async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.".green);
      }
      process.exit(0);
    } catch (err) {
      console.error(`Error closing MongoDB connection: ${err.message}`.red);
      process.exit(1);
    }
  };

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.".green);
      await closeDbAndExit();
    });
  } else {
    await closeDbAndExit();
  }
};

// Detect direct execution for both `node backend/server` and `node backend/server.js`
const isMainModule = (() => {
  if (!process.argv[1]) return false;
  const candidate = path.resolve(process.argv[1]);
  const resolvedEntry = fs.existsSync(candidate)
    ? fs.realpathSync(candidate)
    : fs.existsSync(`${candidate}.js`)
      ? fs.realpathSync(`${candidate}.js`)
      : candidate;
  return resolvedEntry === fs.realpathSync(__filename);
})();

if (isMainModule) {
  validateEnv();
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  startServer();
}

export default app;
