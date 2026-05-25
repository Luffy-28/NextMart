import Product from "../models/productModel.js";
import { Cart } from "../models/cartModel.js";

// Fetch User's Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    return res.status(200).send({
      status: "success",
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot retrieve cart",
    });
  }
};

// Add to Cart
export const addTocart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).send({
        status: "error",
        message: "product id and quantity are required",
      });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).send({
        status: "error",
        message: "quantity should be at least 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    const currentQtyInCart =
      existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    const newQty = currentQtyInCart + qty;

    if (product.stock < newQty) {
      return res.status(400).send({
        status: "error",
        message: `Insufficient stock. Only ${product.stock} items are available, and you have ${currentQtyInCart} in your cart.`,
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: (product.images && product.images[0]) || "",
        price: product.discountedPrice || product.basePrice,
        quantity: qty,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot add to cart",
    });
  }
};

// Update Cart Item Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).send({
        status: "error",
        message: "product id and quantity are required",
      });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).send({
        status: "error",
        message: "quantity should be at least 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not found",
      });
    }

    if (product.stock < qty) {
      return res.status(400).send({
        status: "error",
        message: `Insufficient stock. Only ${product.stock} items are available.`,
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        status: "error",
        message: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = qty;

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Cart item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot update cart quantity",
    });
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).send({
        status: "error",
        message: "product id is required",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Cart not found",
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.items.length === initialLength) {
      return res.status(404).send({
        status: "error",
        message: "Item not found in cart",
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot remove item from cart",
    });
  }
};

// clear the whole cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "cart not found",
      });
    }
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return res.status(200).send({
      status: "success",
      message: "cart cleared successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Failed to clear the cart",
    });
  }
};
