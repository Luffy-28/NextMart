import { Deal } from "../models/dealsModel.js";

// Get active deals (customer view - only active and within date range)
export const getActiveDealsByDate = async (req, res) => {
  try {
    const currentDate = new Date();
    const deals = await Deal.find({
      isActive: true,
      startsAt: { $lte: currentDate },
      endsAt: { $gte: currentDate },
    }).populate("products");

    res.status(200).send({
      status: "success",
      message: "Active deals fetched successfully",
      data: deals,
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
    const deal = await Deal.findById(id).populate("products");

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
