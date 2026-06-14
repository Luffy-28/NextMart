import express from "express";
import { getAllsubcategory, getAllSubCategoryCount } from "../controllers/subCategoryController.js";

const router = express.Router();

router.get("/", getAllSubCategoryCount);
router.get("/:categoryId", getAllsubcategory);

export default router;
