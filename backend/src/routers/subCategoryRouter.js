import express from "express";
import { getAllsubcategory } from "../controllers/subCategoryController.js";

const router = express.Router();

router.get("/:categoryId", getAllsubcategory);

export default router;
