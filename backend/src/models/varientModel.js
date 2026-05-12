// models/Variant.js  ← new file
import mongoose from "mongoose";
import { time } from "node:console";

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    quantity: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default variantSchema;
