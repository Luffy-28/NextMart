import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByTags,
  getProductBySlug,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/tags", getProductsByTags);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

export default router;
