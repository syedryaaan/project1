// NexaStore — Product Routes
// Fix B12: /top must be declared before /:id
import express from "express";
const router = express.Router();

import {
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewArrivals,
} from "../controllers/productContoller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);       // Fix B12: MUST come before /:id
router.get("/featured", getFeaturedProducts);
router.get("/new", getNewArrivals);
router.route("/:id/reviews").post(protect, createProductReview);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
