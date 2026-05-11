import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      search,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (subcategory) query.subCategory = subcategory;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseInt(minPrice);
      if (maxPrice) query.basePrice.$lte = parseInt(maxPrice);
    }
    if (search) query.$text = { $search: search };
    if (rating) query.rating = { $gte: parseInt(rating) };

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
    const product = await Product.findById(req.params.id).select("-__v").lean();
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

// Additional controller functions for creating, updating, and deleting feature [products] can be added here
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    return res.status(200).send({
      status: "success",
      data: products,
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
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).send({
        status: "error",
        message: "Tags query parameter is required",
      });
    }
    const tagsArray = tags.split(',').map(tag => tag.trim());
    const products = await Product.find({ tags: { $in: tagsArray } });
    return res.status(200).send({
      status:"success",
      message:"Products fetched successfully",
      data:products
    })
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Failed to get products by tags",
    });
  }
};


export const getProductBySlug = async (req, res) =>{
  try {
    const {slug} = req.params;
    const product = await Product.findOne({slug, isActive: true}).populate({
      path: "category",
      select: "name slug parent",
      populate:{path:"parent",select:"name slug"}
    })
    if(!product || !product.isActive){
      return res.status(404).send({
        status:"error",
        message:"Product not found"
      })
    }
    return res.status(200).send({
      status:"success",
      message:"Product fetched successfully",
      data:product
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status:"error",
      message:"Error getting product by slug"
    })
  }
}