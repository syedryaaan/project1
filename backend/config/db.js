// NexaStore — Database Connection (Atlas & Local Development Fallback)
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import "colors";
import mongoose from "mongoose";

const PLACEHOLDER_MARKERS = [
  "<DB_PASSWORD>",
  "<YOUR_DB_PASSWORD>",
  "<password>",
  "<username>",
  "<cluster>",
];

let listenersAttached = false;

const connectDB = async () => {
  let uri = process.env.MONGO_URI?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const hasPlaceholder =
    !!uri && PLACEHOLDER_MARKERS.some((marker) => uri.includes(marker));

  if (!uri || hasPlaceholder) {
    if (isProduction) {
      throw new Error(
        !uri
          ? "MONGO_URI environment variable is missing in production."
          : "MONGO_URI contains placeholder values. Configure your real MongoDB Atlas URI in the deployment environment."
      );
    }

    console.log(
      "⚠️  MONGO_URI in .env is missing or contains placeholder password. Attempting local MongoDB fallback (mongodb://127.0.0.1:27017/nexastore)..."
        .yellow
    );
    uri = "mongodb://127.0.0.1:27017/nexastore";
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      "Invalid MONGO_URI format. Connection string must start with 'mongodb://' or 'mongodb+srv://'."
    );
  }

  if (!listenersAttached) {
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`.red);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected.".yellow);
    });
    listenersAttached = true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    const host = conn.connection.host || "";
    const isLocal = host.includes("127.0.0.1") || host.includes("localhost");
    if (isLocal) {
      console.log(
        `✅ Local MongoDB Connected: ${host}/${conn.connection.name}`.cyan
          .underline.bold
      );
      console.log(
        `💡 To connect to MongoDB Atlas instead, update MONGO_URI in your .env file.`
          .grey
      );
    } else {
      console.log(
        `✅ MongoDB Atlas Connected: ${host}`.cyan.underline.bold
      );
    }

    return conn;
  } catch (error) {
    throw new Error(
      `Database connection failed: ${error.message}. Verify your MONGO_URI, credentials, and MongoDB Atlas Network Access (IP allowlist).`
    );
  }
};

export default connectDB;
