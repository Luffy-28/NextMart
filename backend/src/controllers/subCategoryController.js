import { SubCategory } from "../models/subCategoryModel.js";

// get all the sub category by category
export const getAllsubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategory = await SubCategory.find({
      category: categoryId,
      isActive: true,
    });
    if (!subCategory) {
      return res.status(404).send({
        status: "error",
        message: "subcategory not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "sub-category fetched successfully",
      data: subCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "failed to get sub-category",
    });
  }
};
