// NexaStore — Database Connection (Atlas & Local Development Fallback)
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import mongoose from "mongoose";

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri || uri.includes("<DB_PASSWORD>") || uri.includes("<YOUR_DB_PASSWORD>")) {
    console.log(
      "⚠️  MONGO_URI in .env contains placeholder password. Attempting local MongoDB fallback (mongodb://127.0.0.1:27017/nexastore)..."
        .yellow
    );
    uri = "mongodb://127.0.0.1:27017/nexastore";
  }

  try {
    const conn = await mongoose.connect(uri);

    const isLocal = conn.connection.host.includes("127.0.0.1") || conn.connection.host.includes("localhost");
    if (isLocal) {
      console.log(
        `✅ Local MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`.cyan.underline.bold
      );
      console.log(
        `💡 To connect to MongoDB Atlas instead, update <DB_PASSWORD> in your .env file.`.grey
      );
    } else {
      console.log(
        `✅ MongoDB Atlas Connected: ${conn.connection.host}`.cyan.underline.bold
      );
    }

    return conn;
  } catch (error) {
    throw new Error(
      `Database connection failed: ${error.message}. Please check your MongoDB service or configure your Atlas password in .env.`
    );
  }
};

export default connectDB;
