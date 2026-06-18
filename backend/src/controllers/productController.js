import Product from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";
import { SubCategory } from "../models/subCategoryModel.js";
import mongoose from "mongoose";
import {getRecommendationsWithGemini, createEmbedding, cosineSimilarity} from "../helpers/geminaiHelper.js"

const getProductTextForEmbedding = (product) => `
Name: ${product.name}
Brand: ${product.brand || ""}
Category: ${product.category || ""}
Subcategory: ${product.subCategory || ""}
Description: ${product.description || ""}
Tags: ${product.tags?.join(", ") || ""}
Color: ${product.color || ""}
Size: ${product.size || ""}
Price: ${product.discountedPrice || product.basePrice}
Rating: ${product.rating || 0}
`;

// Get all products with pagination, sorting and filtering
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      category,
      subcategory,
      subCategory,
      minPrice,
      maxPrice,
      rating,
      search,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    
    const activeSubcategory = subcategory || subCategory;
    if (activeSubcategory) query.subCategory = activeSubcategory;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice && !isNaN(parseInt(minPrice))) query.basePrice.$gte = parseInt(minPrice);
      if (maxPrice && !isNaN(parseInt(maxPrice))) query.basePrice.$lte = parseInt(maxPrice);
      if (Object.keys(query.basePrice).length === 0) delete query.basePrice;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
        { size: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (rating && !isNaN(parseInt(rating))) {
      const parsedRating = parseInt(rating);
      if (parsedRating > 0) {
        query.rating = { $gte: parsedRating };
      }
    }

    let sortOption = {};
    switch (sort.toLowerCase()) {
      case "price-asc":
        sortOption = { basePrice: 1 };
        break;
      case "price-desc":
        sortOption = { basePrice: -1 };
        break;
      case "rating-high":
        sortOption = { rating: -1 };
        break;
      case "rating-low":
        sortOption = { rating: 1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate({ path: "category", select: "name slug" })
        .populate({ path: "subCategory", select: "name slug" })
        .select("-__v -updatedAt")
        .lean(),
      Product.countDocuments(query),
    ]);

    return res.status(200).send({
      status: "success",
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Failed to get products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "name slug" })
      .populate({ path: "subCategory", select: "name slug" })
      .select("-__v")
      .lean();
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).send({
      status: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Failed to get product",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find({ featured: true }).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments({ featured: true }),
    ]);

    return res.status(200).send({
      status: "success",
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to get featured products",
    });
  }
};

// Get product based on the tags
export const getProductsByTags = async (req, res) => {
  try {
    const { tags, page = 1, limit = 10 } = req.query;
    if (!tags) {
      return res.status(400).send({
        status: "error",
        message: "Tags query parameter is required",
      });
    }
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find({ tags: { $in: tagsArray } })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments({ tags: { $in: tagsArray } }),
    ]);

    return res.status(200).send({
      status: "success",
      message: "Products fetched successfully",
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Failed to get products by tags",
    });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate({
        path: "category",
        select: "name slug",
      })
      .populate({
        path: "subCategory",
        select: "name slug",
      });
    if (!product || !product.isActive) {
      return res.status(404).send({
        status: "error",
        message: "Product not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error getting product by slug",
    });
  }
};


// recomend products using ai

