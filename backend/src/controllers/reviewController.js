import { Review } from "../models/reviewModel.js";
import { Order } from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Helper function to update product rating
const updateProductRatingStats = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((acc, item) => acc + Number(item.rating), 0) /
        reviewCount
      : 0;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      rating: averageRating,
      reviewCount,
    },
    { new: true },
  );

  return updatedProduct;
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const { orderId, productId } = req.params;
    const userId = req.user._id;

    if (!review || rating === undefined) {
      return res.status(400).send({
        status: "error",
        message: "Review and rating are required",
      });
    }

    const numericRating = Number(rating);

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).send({
        status: "error",
        message: "Rating must be between 1 and 5",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).send({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).send({
        status: "error",
        message: "You can only review delivered orders",
      });
    }

    const orderedProduct = order.items.find(
      (item) => item.product && item.product._id.toString() === productId,
    );

    if (!orderedProduct) {
      return res.status(400).send({
        status: "error",
        message: "This product was not found in your order",
      });
    }

    const existingReview = await Review.findOne({
      order: orderId,
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).send({
        status: "error",
        message: "You have already reviewed this product for this order",
      });
    }

    const newReview = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      comment: review,
      rating: numericRating,
    });

    const updatedProduct = await updateProductRatingStats(productId);

    return res.status(201).send({
      status: "success",
      message: "Review added successfully",
      data: newReview,
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Review failed",
    });
  }
};

// Get reviews by product
export const getReviewByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviewData = await Review.find({ product: productId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    if (reviewData.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No reviews found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Reviews fetched successfully",
      data: reviewData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to get reviews",
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { review, rating } = req.body;
    const userId = req.user._id;

    const existingReview = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res.status(404).send({
        status: "error",
        message: "Review not found",
      });
    }

    if (review) {
      existingReview.comment = review;
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).send({
          status: "error",
          message: "Rating must be between 1 and 5",
        });
      }

      existingReview.rating = numericRating;
    }

    await existingReview.save();

    const updatedProduct = await updateProductRatingStats(
      existingReview.product,
    );

    return res.status(200).send({
      status: "success",
      message: "Review updated successfully",
      data: existingReview,
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to update review",
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const existingReview = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res.status(404).send({
        status: "error",
        message: "Review not found",
      });
    }

    const productId = existingReview.product;

    await Review.findByIdAndDelete(reviewId);

    const updatedProduct = await updateProductRatingStats(productId);

    return res.status(200).send({
      status: "success",
      message: "Review deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to delete review",
    });
  }
};
