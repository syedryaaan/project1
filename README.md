# NexaStore — Enterprise-Grade MERN E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://react.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen.svg)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**NexaStore** is a full-featured, commercial-grade, multi-role e-commerce web platform engineered using the MERN stack (MongoDB, Express, React, Node.js). It transforms standard online shopping into an intuitive, high-performance customer experience featuring modern dark/light styling, server-side price protection, real-time analytics, comprehensive administration controls, and verified payment checkout.

---

## 🌟 Key Features

### Customer Experience & Storefront
- **Modern Brand Identity:** Custom design system built with CSS variables, responsive typography, and glassmorphic navigation.
- **Announcement Banner:** Animated announcement header featuring active promotions and discount codes.
- **Dynamic Search & Filtering:** Instant keyword query resolution, category browsing, price filters, rating filters, and pagination.
- **Interactive Product Catalog:** Visual product cards with discount tags, featured badges, stock counters, and one-click add to cart.
- **Customer Ratings & Reviews:** Verified user ratings, review submission with validation, and prevention of duplicate reviews.
- **Wishlist System:** One-click wishlist toggling for authenticated users.
- **Persistent Shopping Cart:** Redux-powered synchronized cart state persisted to `localStorage` with subtotal, tax, and automated free-shipping qualification.
- **Dark & Light Mode:** Seamless theme toggling with zero flash of unstyled content.

### Checkout & Payments
- **Multi-Step Checkout:** Guided steps (Authentication &rarr; Shipping Address &rarr; Payment Method &rarr; Order Review).
- **Server-Side Price Recalculation:** All item prices, taxes (15%), shipping fees, and discounts are recomputed server-side from database records before persisting to eliminate client-side price tampering.
- **PayPal Integration:** Modern `@paypal/react-paypal-js` button integration with order verification.
- **Delivery & Payment Tracking:** Granular states (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) with timestamp auditing.

### Administration & Analytics
- **Executive KPI Dashboard:** Real-time summary cards displaying Total Revenue, Total Orders, Active Catalog Items, and Registered Customers.
- **Low-Stock Alerting:** Instant visibility into items with zero inventory or &le; 5 units remaining.
- **Recent Transaction Feed:** 7-day revenue trend aggregation and latest order audit log.
- **Product Management:** Full CRUD capability with image file uploads (`multer`), price updates, inventory controls, and discount assignments.
- **Order Management:** Global order overview with delivery marking and status updates.
- **Customer Account Management:** User authorization control, administrator privilege delegation, and account removal.

### Security & Architecture
- **Helmet HTTP Headers:** Content security headers enabled for enhanced transport layer safety.
- **Express Rate Limiting:** Global API rate limiting (200 req / 15 min) and stricter auth rate limiting (20 req / 15 min) against brute-force attacks.
- **NoSQL Injection Defense:** `express-mongo-sanitize` sanitizes incoming request payloads.
- **Password Protection:** Passwords securely hashed with `bcryptjs` using a salt work factor of 12.
- **JWT Authorization:** JSON Web Token payload generation with protected route middleware and role-based access control.
- **Database Graceful Shutdown:** Process signals (`SIGINT`, `SIGTERM`) cleanly close HTTP connections and Mongoose pools.

---

## 🏗️ Project Architecture

```
NexaStore/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection & graceful shutdown
│   ├── controllers/
│   │   ├── orderController.js     # Orders, analytics, payments, delivery
│   │   ├── productContoller.js    # Product catalog, reviews, search, CRUD
│   │   └── userController.js      # Authentication, profile, user admin
│   ├── data/
│   │   ├── products.js            # Curated catalog seed data
│   │   └── users.js               # Initial users seed data
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect & admin role check
│   │   └── errorMiddleware.js     # Centralized 404 & 500 error handler
│   ├── models/
│   │   ├── categoryModel.js       # Category hierarchy & metadata
│   │   ├── couponModel.js         # Promotional discounts & coupons
│   │   ├── orderModel.js          # Orders, items, shipping, paymentResult
│   │   ├── productModel.js        # Products, reviews, pricing, inventory
│   │   ├── userModel.js           # Users, credentials, address list
│   │   └── wishlistModel.js       # Customer wishlist collection
│   ├── routes/
│   │   ├── orderRoutes.js         # /api/orders
│   │   ├── productRoutes.js       # /api/products
│   │   ├── uploadRoutes.js        # /api/upload
│   │   └── userRoutes.js          # /api/users
│   ├── seeder.js                  # DB Seeder (categories, users, products)
│   ├── server.js                  # Express application & lifecycle entrypoint
│   └── utils/
│       └── generateToken.js       # JWT signing utility
├── frontend/
│   ├── public/
│   │   ├── favicon.svg            # NexaStore custom SVG icon
│   │   ├── index.html             # HTML5 template with Inter typography
│   │   └── manifest.json          # PWA metadata
│   └── src/
│       ├── actions/               # Redux thunk action dispatchers
│       ├── components/            # Header, Footer, AdminNav, ProductCard, etc.
│       ├── constants/             # Redux action type constants
│       ├── reducers/              # Redux state slice reducers
│       ├── screens/               # RRD v6 page screens
│       ├── App.js                 # Router tree & toast container
│       ├── index.css              # NexaStore design system & themes
│       ├── index.js               # React 18 createRoot bootstrap
│       └── store.js               # Redux store & DevTools integration
├── uploads/                       # Static uploaded product media
├── .env.example                   # Environment variable template
├── package.json                   # Root workspace dependencies & scripts
├── PROJECT_AUDIT.md               # Architecture audit & migration notes
└── README.md                      # Comprehensive documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router DOM v6, Redux, Redux Thunk, React Icons, React Toastify, React Helmet |
| **Backend** | Node.js, Express.js 5, Multer, Helmet, Express Rate Limit, Express Mongo Sanitize, CORS, Morgan |
| **Database** | MongoDB Atlas, Mongoose 9 |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js (12 rounds), Input Sanitization |
| **Payments** | PayPal Developer SDK (`@paypal/react-paypal-js`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or newer
- [npm](https://www.npmjs.com/) v9 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB Community Edition)

### 2. Installation

Clone your repository and install dependencies for both root and frontend:

```bash
# Clone repository
git clone https://github.com/mariosknl/ProShop.git nexastore
cd nexastore

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root directory (copied from `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```ini
# ─── MongoDB Atlas ────────────────────────────────────────────────────────────
# Replace <DB_PASSWORD> with your Atlas database user password
MONGO_URI=mongodb+srv://syedryaaan_db_user:<DB_PASSWORD>@cluster0.ageb2ld.mongodb.net/nexastore?retryWrites=true&w=majority

# ─── Environment ──────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ─── JWT Secret ───────────────────────────────────────────────────────────────
# Generate via: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_cryptographic_64_byte_key

# ─── Payment Gateway ──────────────────────────────────────────────────────────
# Set to 'sb' for sandbox testing or your real PayPal Client ID
PAYPAL_CLIENT_ID=sb
```

> [!WARNING]
> Never commit `.env` to GitHub or version control. `.env` is already configured in `.gitignore`.

---

## 🗄️ MongoDB Atlas Setup & Database Seeding

### 1. Configure Atlas Cluster
1. Log in to [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Select your cluster: `cluster0.ageb2ld.mongodb.net`.
3. In **Database Access**, verify your database user: `syedryaaan_db_user`.
4. In **Network Access**, ensure your IP address is whitelisted (or `0.0.0.0/0` during development).
5. Add your database password to the `MONGO_URI` in `.env`.

### 2. Seed Initial Products & Users
Populate the database with sample categories, users, and tech products:

```bash
# Import sample data into MongoDB Atlas
npm run data:import

# (Optional) To clear data at any time:
# npm run data:destroy
```

### Pre-configured Seed Accounts
| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@nexastore.com` | `nexaadmin123` |
| **Customer** | `alex@example.com` | `password123` |
| **Customer** | `sarah@example.com` | `password123` |

---

## 💻 Running the Application

### Development Mode (Concurrent Backend & Frontend)
To run both the Express backend API and the React development server concurrently:

```bash
npm run dev
```

- **Frontend Application:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

### Running Backend Only
```bash
npm run server
```

### Running Frontend Only
```bash
npm run client
```

---

## 🧪 Testing & Verification

### Compile Production Frontend Build
```bash
cd frontend
npm run build
```

### Verify Backend Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Top rated products
curl http://localhost:5000/api/products/top
```

---

## 🚢 Deployment Guide

### Deploying to Render / Heroku / Railway
1. Set the following Environment Variables in your hosting dashboard:
   - `MONGO_URI`
   - `NODE_ENV=production`
   - `JWT_SECRET`
   - `PAYPAL_CLIENT_ID`
2. Build command:
   ```bash
   npm install && npm install --prefix frontend --legacy-peer-deps && npm run build --prefix frontend
   ```
3. Start command:
   ```bash
   npm start
   ```

In `production` mode, the Express server automatically serves the compiled React assets from `frontend/build` and routes unknown requests to `index.html`.

---

## 📜 Attribution & License

This project is licensed under the **MIT License**.

### Original Project Attribution:
- **Upstream Repository:** [ProShop](https://github.com/mariosknl/ProShop.git) by [Marios Kanellopoulos](https://github.com/mariosknl).
- **Tutorial & Educational Foundation:** [Brad Traversy](https://github.com/bradtraversy) / [Traversy Media](http://traversymedia.com/).

*Transformed, redesigned, hardened, and modernized into NexaStore by Syed Rayyan.*
