// NexaStore — MongoDB Atlas connection
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("<DB_PASSWORD>") || uri.includes("<YOUR_DB_PASSWORD>")) {
    throw new Error(
      "MONGO_URI contains placeholder password. Please update your password in .env file before connecting."
    );
  }

  const conn = await mongoose.connect(uri);

  console.log(
    `✅ MongoDB Atlas Connected: ${conn.connection.host}`.cyan.underline.bold
  );
  return conn;
};

export default connectDB;
