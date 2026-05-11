import mongoose     from "mongoose";
import variantSchema from "./varientModel.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    description: {
      type:     String,
      required: true,
    },
    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Category",
      required: true,
      index:    true,
    },
    brand: {
      type:  String,
      index: true,
    },
    basePrice: {
      type:     Number,
      required: true,
    },

    // ✅ variantSchema now imported from Variant.js
    variants: [variantSchema],

    tags:   [{ type: String }],
    images: [{ type: String }],

    featured: {
      type:    Boolean,
      default: false,
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    slug: {
      type:      String,
      unique:    true,
      lowercase: true,
    },

    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },
    reviewCount: {
      type:    Number,
      default: 0,
    },

    metaTitle:       String,
    metaDescription: String,
  },
  { timestamps: true },
);

// ✅ FIX 4: auto-generate slug from name
// Was: missing — slug stayed undefined on every Product.create()
// Now: fires automatically before every save
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, "variants.color": 1 });
productSchema.index({ basePrice: 1 });

export default mongoose.model("Product", productSchema);