import express from "express";
import {
  getActiveDealsByDate,
  getDealById,
} from "../controllers/dealController.js";

const router = express.Router();

router.get("/", getActiveDealsByDate);
router.get("/:id", getDealById);

export default router;
