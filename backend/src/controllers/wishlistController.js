import { Wishlist } from "../models/wishListModel.js";

// Get the logged-in user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate("products", "name images basePrice discountedPrice category isActive");

    return res.status(200).send({
      status: "success",
      message: "Wishlist fetched successfully",
      data: wishlist?.products || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to fetch wishlist" });
  }
};

// Add a product to the wishlist (ignores duplicates)
export const addToWishlist = async (req, res) => {
  try {
    const userId    = req.user._id;
    const { productId } = req.params;

    // Use $addToSet to prevent duplicates
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    ).populate("products", "name images basePrice discountedPrice category");

    return res.status(200).send({
      status: "success",
      message: "Product added to wishlist",
      data: wishlist.products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to add to wishlist" });
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId    = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products", "name images basePrice discountedPrice category");

    return res.status(200).send({
      status: "success",
      message: "Product removed from wishlist",
      data: wishlist?.products || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to remove from wishlist" });
  }
};

// Clear the entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    await Wishlist.findOneAndUpdate({ user: userId }, { products: [] });
    return res.status(200).send({
      status: "success",
      message: "Wishlist cleared",
      data: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "error", message: "Failed to clear wishlist" });
  }
};
