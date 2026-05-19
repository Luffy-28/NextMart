import { Address } from "../models/addressModel.js";
import { User } from "../models/userModel.js";

//GET USER DETAILS
export const getUserDetail = async (req, res) => {
  try {
    return res.status(200).send({
      status: "success",
      message: "User details fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error fetching user details",
    });
  }
};
// Update address in user profile
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;
    if (!address) {
      return res.status(400).send({
        status: "error",
        message: "Address is required",
      });
    }
    if (address.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }
    const userAddress = await Address.insertOne({
      user: userId,
      ...address,
      isDefault: address.isDefault ?? false,
    });
    if (!userAddress) {
      return res.status(500).send({
        status: "error",
        message: "Error saving address",
      });
    }
    return res.status(201).send({
      status: "success",
      message: "Address saved successfully",
      data: userAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error saving address",
    });
  }
};

// Get User Address

export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ user: userId });
    if (!addresses) {
      return res.status(404).send({
        status: "error",
        message:
          "No address found for tge user. Add an address to fetch it here",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Address fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error fetching address",
    });
  }
};

// update User Detials
export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const upadatedPayload = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, upadatedPayload, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error updating user details",
    });
  }
};

// updated Address
export const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user._id;
    const { address } = req.body;
    if (!addressId || !address || !userId) {
      return res.status(400).send({
        status: "error",
        message: "Address id and user id is required",
      });
    }
    if (address.isDefault) {
      await Address.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { isDefault: false },
      );
    }
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      address,
      {
        new: true,
      },
    );
    if (!updatedAddress) {
      return res.status(404).send({
        status: "error",
        message: "Address not found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "error updating address",
    });
  }
};
