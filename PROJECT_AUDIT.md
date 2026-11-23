# PROJECT AUDIT — ProShop → NexaStore Transformation
*Audited: 2026-11-24 | Auditor: Principal Software Architect*

---

## 1. LICENSE & ATTRIBUTION

| Field | Value |
|-------|-------|
| Original license | MIT |
| Original author | Marios Kanellopoulos ([@mariosknl](https://github.com/mariosknl)) |
| Upstream tutorial | Brad Traversy / Traversy Media |
| Obligation | Retain copyright notice in source; credit in README is good practice |

> [!IMPORTANT]
> MIT license permits modification and redistribution. The copyright header **must** be retained in relevant source files. The project README credits both Marios Kanellopoulos and Brad Traversy, which must be preserved.

---

## 2. EXISTING ARCHITECTURE

```
ProShop-main/
├── backend/
│   ├── config/db.js              # Mongoose connection
│   ├── controllers/              # Business logic (3 controllers)
│   ├── data/                     # Seed data (products.js, users.js)
│   ├── middleware/               # auth + error middleware
│   ├── models/                   # User, Product, Order (3 models)
│   ├── routes/                   # 4 route files
│   ├── utils/generateToken.js    # JWT helper
│   ├── seeder.js                 # DB seeder script
│   └── server.js                 # Express entry point
├── frontend/
│   └── src/
│       ├── actions/              # Redux thunk actions (4 files)
│       ├── components/           # Shared components (12)
│       ├── constants/            # Action type constants (4 files)
│       ├── reducers/             # Redux reducers (4 files)
│       ├── screens/              # Page-level components (13 screens)
│       ├── App.js                # Router configuration
│       ├── index.js              # React entry point
│       ├── store.js              # Redux store
│       └── index.css             # Minimal global styles
├── uploads/                      # Multer file uploads
├── package.json                  # Root (backend) package
└── Procfile                      # Heroku deployment
```

### Tech Stack Versions

| Package | Version | Status |
|---------|---------|--------|
| Node/Express | Express ^5.0 | ✅ Current |
| React | 17.0.2 | ⚠️ Outdated (v19 current) |
| react-router-dom | 6.27.0 | ✅ Current |
| Redux | 5.0.1 | ✅ Current |
| redux-thunk | 3.1.0 | ✅ Current |
| Mongoose | ^9.0.0 | ✅ Current |
| bcryptjs | ^3.0.0 | ✅ Current |
| jsonwebtoken | ^9.0.0 | ✅ Current |
| react-bootstrap | 2.10.5 | ✅ Current |
| react-paypal-button-v2 | 2.6.3 | ⚠️ Unmaintained |
| @redux-devtools/extension | 3.3.0 | ✅ Current |
| multer | ^2.0.0 | ✅ Current |

---

## 3. EXISTING FUNCTIONALITY

| Feature | Status | Notes |
|---------|--------|-------|
| Product listing + pagination | ✅ Works | pageSize hardcoded to 3 |
| Product search (keyword) | ✅ Works | regex search on `name` only |
| Product detail view | ✅ Works | single image, basic layout |
| Product reviews | ✅ Works | one review per user enforced |
| Top-rated products carousel | ✅ Works | limit 3 |
| Shopping cart (Redux + localStorage) | ✅ Works | persistent |
| User registration | ✅ Works | basic validation |
| User login / JWT auth | ✅ Works | 30-day token |
| User profile update | ✅ Works | name, email, password |
| Order creation | ✅ Works | saves to MongoDB |
| PayPal payment | ✅ Works | frontend SDK, server updates isPaid |
| Order history (my orders) | ✅ Works | user dashboard |
| Admin: product CRUD | ✅ Works | create/edit/delete |
| Admin: user management | ✅ Works | view/edit/delete |
| Admin: order management | ✅ Works | mark delivered |
| Image upload (Multer) | ✅ Works | local disk only |
| DB seeder | ✅ Works | destroys & reimports |

---

## 4. BUGS & BROKEN ITEMS

| # | Location | Bug | Severity |
|---|----------|-----|----------|
| B1 | `errorMiddleware.js` L4 | `next(err)` → should be `next(error)` — `err` is undefined | 🔴 Critical |
| B2 | `db.js` L6-8 | `useNewUrlParser`, `useUnifiedTopology`, `useCreateIndex` are removed in Mongoose 7+ — will throw warnings/errors | 🔴 Critical |
| B3 | `productController.js` L50 | `product.remove()` deprecated in Mongoose 7+; use `deleteOne()` | 🔴 Critical |
| B4 | `userController.js` L123 | `user.remove()` deprecated; use `deleteOne()` | 🔴 Critical |
| B5 | `App.js` | Uses React Router v5 `<Route component={...}>` API — broken with RRD v6 | 🔴 Critical |
| B6 | `App.js` | `composeWithDevTools` from `redux-devtools-extension` — package is `@redux-devtools/extension` | 🔴 Critical |
| B7 | `Header.js` | `<Route render={...}>` RRD v5 API — broken with v6 | 🔴 Critical |
| B8 | `HomeScreen.js` | `match.params` from v5 props — broken with RRD v6 hooks model | 🔴 Critical |
| B9 | `ProductScreen.js` | `history.push()`, `match.params` v5 API — broken with RRD v6 | 🔴 Critical |
| B10 | `CartScreen.js` | Same `match`/`history`/`location` v5 props pattern — broken | 🔴 Critical |
| B11 | `LoginScreen.js` | Same `location`/`history` v5 props — broken | 🔴 Critical |
| B12 | `productRoutes.js` L17 | `/top` route registered **after** `/:id` — will never match | 🔴 Critical |
| B13 | `store.js` | `composeWithDevTools` import from wrong package | 🟡 Medium |
| B14 | `orderController.js` | `itemsPrice` received from client but not in Order model — trusted from frontend | 🟡 Medium |
| B15 | Frontend | No `axios` baseURL configured — relies solely on CRA proxy | 🟡 Medium |

---

## 5. SECURITY VULNERABILITIES

| # | Location | Vulnerability | Severity |
|---|----------|--------------|----------|
| S1 | `server.js` | No `helmet` (HTTP security headers) | 🔴 Critical |
| S2 | `server.js` | No `express-rate-limit` | 🔴 Critical |
| S3 | `server.js` | No CORS configuration | 🔴 Critical |
| S4 | `orderController.js` | `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice` all taken from request body — price manipulation possible | 🔴 Critical |
| S5 | `productController.js` | Keyword search uses raw regex — no sanitisation (ReDoS risk) | 🟡 Medium |
| S6 | `uploadRoutes.js` | File type validation needs strengthening | 🟡 Medium |
| S7 | `generateToken.js` | `expiresIn: '30d'` with no refresh token strategy | 🟡 Medium |
| S8 | `server.js` | Morgan logs in development only — no production logging | 🟡 Medium |
| S9 | Backend | No input sanitization / XSS protection | 🟡 Medium |
| S10 | `errorMiddleware.js` | Stack trace exposed in non-production check | 🟢 Low |

---

## 6. UI/UX WEAKNESSES

| # | Issue |
|---|-------|
| U1 | Minimal homepage — no hero, categories, promotions, or marketing copy |
| U2 | No dark/light theme |
| U3 | No wishlist functionality |
| U4 | No product image gallery (single image only) |
| U5 | No loading skeletons (spinner only) |
| U6 | No toast notifications — uses `alert()` for review confirmation |
| U7 | No animated transitions |
| U8 | Bootstrap dark navbar with no brand customisation |
| U9 | No announcement bar |
| U10 | No newsletter subscription |
| U11 | No category browsing |
| U12 | No product filters (brand, price range, rating, availability) |
| U13 | No "recently viewed" or "related products" |
| U14 | No quantity ± buttons (dropdown only) |
| U15 | Minimal footer |
| U16 | No 404 page |
| U17 | Bare admin dashboard — no analytics, charts or KPIs |
| U18 | No coupon / discount system |
| U19 | Mobile experience is functional but not polished |
| U20 | No favicon customisation |

---

## 7. MISSING FUNCTIONALITY

| Feature | Priority |
|---------|----------|
| Wishlist | High |
| Category model & browsing | High |
| Advanced product filters | High |
| Coupon / discount codes | High |
| Forgot password / reset | High |
| Admin analytics dashboard | High |
| Toast notification system | High |
| Dark/light theme | Medium |
| Product image gallery (multi-image) | Medium |
| Order tracking status | Medium |
| Rate limiting | High |
| Helmet (HTTP headers) | High |
| Input sanitization | High |
| Server-side price recalculation | High |
| Refresh token / token rotation | Medium |
| Email notifications | Medium |
| Sitemap / SEO meta tags | Medium |

---

## 8. RECOMMENDED IMPROVEMENTS

### Backend
1. Fix all deprecated Mongoose methods (`remove()` → `deleteOne()`)
2. Remove Mongoose connection options no longer supported
3. Recalculate `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice` server-side
4. Add `helmet`, `express-rate-limit`, `cors`, `express-mongo-sanitize`
5. Fix `notFound` middleware `err` → `error`
6. Move `/top` route before `/:id` in product routes
7. Add Coupon, Category, Wishlist models
8. Add admin analytics endpoint
9. Add forgot-password / reset-password flow
10. Add `morgan` production logging (or Winston)

### Frontend
1. Upgrade from React 17 → React 18 (or refactor for v17 compat + fix RRD v6)
2. Fix all React Router v5 → v6 patterns (`useNavigate`, `useParams`, `useLocation`)
3. Replace `redux-devtools-extension` with `@redux-devtools/extension`
4. Replace `react-paypal-button-v2` with `@paypal/react-paypal-js`
5. Add `react-toastify` for notifications
6. Add full brand redesign with custom CSS variables
7. Build premium homepage (hero, categories, featured, bestsellers, newsletter)
8. Build wishlist system
9. Build advanced filter sidebar
10. Build admin analytics dashboard with charts

---

## 9. IMPLEMENTATION ROADMAP

### Stage 1 (Complete ✅) — Audit
Understand existing codebase, identify all bugs and gaps.

### Stage 2 — Backend Hardening
- Fix all critical bugs (B1–B15)
- Add security middleware (helmet, rate-limit, cors, sanitize)
- Recalculate prices server-side
- Add Category, Coupon, Wishlist models
- Add admin analytics endpoint
- Fix seeder

### Stage 3 — MongoDB Atlas Integration
- Update `db.js` (remove deprecated options)
- Configure `.env` with Atlas URI
- Validate connection startup

### Stage 4 — Frontend Architecture Fix
- Migrate all screens from RRD v5 to v6 (`useNavigate`, `useParams`, `useLocation`)
- Fix store.js Redux DevTools import
- Replace PayPal library
- Add toast notification system

### Stage 5 — Brand Identity & Complete Redesign
- Brand: **NexaStore** — Premium Tech & Lifestyle Commerce
- Design system: custom CSS variables, Inter/Poppins fonts, dark palette
- Redesign Header, Footer, Product cards
- Build premium HomePage with hero, categories, features
- Build wishlist, advanced filters, loading skeletons

### Stage 6 — Advanced Features
- Wishlist (backend + frontend)
- Coupon / discount codes (backend + frontend)
- Advanced product search & filter
- Admin analytics dashboard

### Stage 7 — Testing & QA
- Test all API endpoints
- Test all user flows
- Fix remaining console errors

### Stage 8 — Documentation
- Complete README.md with setup, env vars, MongoDB Atlas instructions

---

*This audit document is a living reference. Update as changes are made.*
