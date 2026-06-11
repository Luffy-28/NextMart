import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getUserDetail,
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  updateUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserDetail);
router.get("/address", authMiddleware, getAddress);
router.post("/addAddress", authMiddleware, addAddress);
router.patch("/me", authMiddleware, updateUserDetails);
router.patch("/address/:id", authMiddleware, updateAddress);
router.delete("/address/:id", authMiddleware, deleteAddress);

export default router;
