//add review

import { Review } from "../models/reviewModel.js";
export const addReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "items.product",
    );
    if (!order) {
      return res.status(404).send({ 
        status: "error",
        message: "order not found" 
      });
    }
    if(order.orderStatus !== "delivered"){
        return res.status(400).send({ 
            status: "error",
            message: "You can only review the delivered order" 
          });
    }
    //check if the user has already review for the order
    const existingReview = await Review.findOne({
      order: orderId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).send({
        status: "error",
        message: "you have already reviewd the product",
      });
    }
    const newReview = await Review.insertOne({
      user: userId,
      product: order.items[0].product._id,
      order: orderId,
      comment: review,
      rating,
    });
    return res.status(201).send({
      status: "success",
      message: "review added successfully",
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "review failed",
    });
  }
};

// get review by products

export const getReviewByProduct = async (req, res) => {
  try {
    const {productId} = req.params;
    const reviewData = await Review.find({productId}).populate(
      "user",
      "name profileImage"
    );
    if(!reviewData){
      return res.status(404).send({
        status: "error",
        message: "No reviews found"
      })
    }
    return res.status(200).send({
      status: "success",
      message: "review fetched successfully",
      data: reviewData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "failed to get reviews",
    });
  }
};

// update review


//delete review
