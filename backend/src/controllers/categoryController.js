import { Category } from "../models/categoryModel.js";

// get all category
export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    return res.status(200).send({
      status: "success",
      message: "category fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "failed to get category",
    });
  }
};
