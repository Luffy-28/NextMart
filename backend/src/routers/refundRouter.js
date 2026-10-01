import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { submitRefundRequest, getMyRefundRequest } from "../controllers/refundController.js";

const router = express.Router();

// POST /api/v1/refunds/:orderId — customer submits a cancel or return request
router.post("/:orderId", authMiddleware, submitRefundRequest);

// GET /api/v1/refunds/:orderId — customer checks the status of their request
router.get("/:orderId", authMiddleware, getMyRefundRequest);

export default router;
