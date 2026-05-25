import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

// Auth routes: strict — 20 attempts per 15 min (login, register, OTP)
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs || 15 * 60 * 1000,
  max: config.rateLimit.maxRequests || 20,
  message: { status: "error", message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment routes: very strict — 10 attempts per 15 min
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "error", message: "Too many payment requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API: loose — 200 requests per 15 min (products, categories, etc.)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { status: "error", message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
