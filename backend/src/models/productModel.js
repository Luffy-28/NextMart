import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: { type: String },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    subCategory: {
      type: String,
      index: true,
    },
    brand: {
      type: String,
      index: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    variants: [variantSchema],
    tags: [{ type: String }],
    images: [{ type: String }],
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, "variants.color": 1 });
productSchema.index({ basePrice: 1 });

export default mongoose.model("Product", productSchema);
