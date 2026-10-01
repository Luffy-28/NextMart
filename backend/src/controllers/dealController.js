import { Deal } from "../models/dealsModel.js";
import Product from "../models/productModel.js";

// Get active deals (customer view - only active and within date range)
// Populates both products and categories so the Deals page can show both
export const getActiveDealsByDate = async (req, res) => {
  try {
    const currentDate = new Date();
    const deals = await Deal.find({
      isActive: true,
      startsAt: { $lte: currentDate },
      endsAt:   { $gte: currentDate },
    })
      .populate("products",   "name images basePrice discountedPrice category")
      .populate("categories", "name image slug");

    // For category-based deals, also resolve the products in those categories
    // so the Deals.jsx page can display them
    const dealsWithCategoryProducts = await Promise.all(
      deals.map(async (deal) => {
        const dealObj = deal.toObject();

        if (deal.categories && deal.categories.length > 0) {
          const categoryIds = deal.categories.map((c) => c._id);
          const categoryProducts = await Product.find({
            category: { $in: categoryIds },
            isActive: true,
          }).select("name images basePrice discountedPrice category").limit(20);

          dealObj.categoryProducts = categoryProducts;
        } else {
          dealObj.categoryProducts = [];
        }

        return dealObj;
      })
    );

    res.status(200).send({
      status: "success",
      message: "Active deals fetched successfully",
      data: dealsWithCategoryProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Failed to fetch active deals",
    });
  }
};

// Get a deal by ID
export const getDealById = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findById(id)
      .populate("products",   "name images basePrice discountedPrice category")
      .populate("categories", "name image slug");

    if (!deal) {
      return res.status(404).send({
        status: "error",
        message: "Deal not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "Deal fetched successfully",
      data: deal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Failed to fetch deal",
    });
  }
};
