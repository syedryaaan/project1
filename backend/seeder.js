// NexaStore — Database Seeder
// Original project by Marios Kanellopoulos (MIT), adapted for NexaStore
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "colors";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import Category from "./models/categoryModel.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    description: "Cutting-edge gadgets and consumer electronics",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Audio",
    slug: "audio",
    icon: "🎧",
    description: "Premium headphones, speakers and audio equipment",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: "🎮",
    description: "Consoles, accessories and gaming gear",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Photography",
    slug: "photography",
    icon: "📷",
    description: "Cameras, lenses and photography accessories",
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    icon: "🏠",
    description: "Smart devices and home automation",
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: "🖱️",
    description: "Peripherals and tech accessories",
    isActive: true,
    sortOrder: 6,
  },
];

const users = [
  {
    name: "NexaStore Admin",
    email: "admin@nexastore.com",
    password: "nexaadmin123",
    isAdmin: true,
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    isAdmin: false,
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    password: "password123",
    isAdmin: false,
  },
];

const products = [
  {
    name: "NexaSound Pro X1 Wireless Headphones",
    image: "/images/airpods.jpg",
    description:
      "Experience audio like never before with the NexaSound Pro X1. Active noise cancellation, 40-hour battery life, and premium drivers deliver concert-hall clarity for audiophiles and commuters alike.",
    brand: "NexaSound",
    category: "Audio",
    price: 149.99,
    countInStock: 15,
    rating: 4.5,
    numReviews: 24,
    isFeatured: true,
    tags: ["wireless", "noise-cancelling", "bluetooth"],
  },
  {
    name: "QuantumX Z9 Pro Flagship Smartphone",
    image: "/images/phone.jpg",
    description:
      "The QuantumX Z9 Pro redefines mobile excellence with a triple 108MP camera system, 120Hz AMOLED display, and all-day 5000mAh battery. Future-proof 5G connectivity included.",
    brand: "QuantumX",
    category: "Electronics",
    price: 849.99,
    countInStock: 8,
    rating: 4.7,
    numReviews: 31,
    isFeatured: true,
    discount: 10,
    tags: ["smartphone", "5g", "flagship"],
  },
  {
    name: "VisionPro 4K Mirrorless Camera",
    image: "/images/camera.jpg",
    description:
      "Capture life in breathtaking 4K with the VisionPro Mirrorless. Its 45MP full-frame sensor, 20fps burst mode, and AI autofocus make it the choice of professional photographers worldwide.",
    brand: "VisionPro",
    category: "Photography",
    price: 1199.99,
    countInStock: 5,
    rating: 4.8,
    numReviews: 18,
    isFeatured: true,
    tags: ["mirrorless", "4k", "professional"],
  },
  {
    name: "NexaPlay Station Ultra",
    image: "/images/playstation.jpg",
    description:
      "Next-generation gaming at its finest. The NexaPlay Ultra delivers 8K gaming, ray tracing, and a 1TB SSD with zero load times. Includes dual controllers and 3-month gaming subscription.",
    brand: "NexaPlay",
    category: "Gaming",
    price: 549.99,
    countInStock: 12,
    rating: 4.9,
    numReviews: 42,
    isFeatured: true,
    tags: ["console", "8k", "gaming"],
  },
  {
    name: "PrecisionEdge Pro Gaming Mouse",
    image: "/images/mouse.jpg",
    description:
      "Dominate every match with the PrecisionEdge Pro. 25,600 DPI optical sensor, 7 programmable buttons, and adaptive RGB lighting. Engineered for esports professionals.",
    brand: "PrecisionEdge",
    category: "Accessories",
    price: 69.99,
    countInStock: 25,
    rating: 4.3,
    numReviews: 56,
    isFeatured: false,
    tags: ["gaming", "mouse", "rgb"],
  },
  {
    name: "HomeSphere AI Assistant Speaker",
    image: "/images/alexa.jpg",
    description:
      "Transform your home with HomeSphere AI. Multi-room audio, smart home hub functionality, and an intelligent assistant that learns your preferences. 360° immersive sound in a sleek, compact design.",
    brand: "HomeSphere",
    category: "Smart Home",
    price: 79.99,
    countInStock: 0,
    rating: 4.2,
    numReviews: 29,
    isFeatured: false,
    tags: ["smart-home", "ai", "speaker"],
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    await Category.insertMany(categories);
    console.log("✅ Categories imported".green);

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    console.log("✅ Users imported".green);

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));

    await Product.insertMany(sampleProducts);
    console.log("✅ Products imported".green);

    console.log("\n🚀 NexaStore data imported successfully!".green.inverse);
    console.log("Admin login: admin@nexastore.com / nexaadmin123".cyan);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("🗑️  All data destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

const run = async () => {
  try {
    await connectDB();
    if (process.argv[2] === "-d") {
      await destroyData();
    } else {
      await importData();
    }
  } catch (error) {
    console.error(`❌ ${error.message}`.red.inverse);
    process.exit(1);
  }
};

run();
