import { Product } from "../models/productModel.js";
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
      data: cart
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot retrieve cart"
    });
  }
};

// Add to Cart
export const addTocart = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !variantId || quantity === undefined) {
      return res.status(400).send({
        status: "error",
        message: "product id, variant id, and quantity are required"
      });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).send({
        status: "error",
        message: "quantity should be at least 1"
      });
    }

    // 1. Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not found"
      });
    }

    // 2. Find variant inside product's variants array (since Variant is an embedded schema)
    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).send({
        status: "error",
        message: "Selected product variant not found"
      });
    }

    // 3. Find or create Cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 4. Check if item with this product AND variant already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              item.variantId.toString() === variantId
    );

    const currentQtyInCart = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    const newQty = currentQtyInCart + qty;

    // 5. Check variant stock limit (variant.quantity represents its stock/quantity)
    if (variant.quantity < newQty) {
      return res.status(400).send({
        status: "error",
        message: `Insufficient stock. Only ${variant.quantity} items are available, and you have ${currentQtyInCart} in your cart.`
      });
    }

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        variantId: variantId,
        sku: variant.sku,
        name: product.name,
        image: (variant.images && variant.images[0]) || (product.images && product.images[0]) || "",
        color: variant.color,
        size: variant.size,
        price: variant.discountedPrice || variant.price,
        quantity: qty
      });
    }

    // 6. Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // 7. Save cart
    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Item added to cart successfully",
      data: cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot add to cart"
    });
  }
};

// Update Cart Item Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !variantId || quantity === undefined) {
      return res.status(400).send({
        status: "error",
        message: "product id, variant id, and quantity are required"
      });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).send({
        status: "error",
        message: "quantity should be at least 1"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not found"
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).send({
        status: "error",
        message: "Selected product variant not found"
      });
    }

    if (variant.quantity < qty) {
      return res.status(400).send({
        status: "error",
        message: `Insufficient stock. Only ${variant.quantity} items are available.`
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              item.variantId.toString() === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        status: "error",
        message: "Item not found in cart"
      });
    }

    cart.items[itemIndex].quantity = qty;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Cart item quantity updated successfully",
      data: cart
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot update cart quantity"
    });
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user._id;

    if (!productId || !variantId) {
      return res.status(400).send({
        status: "error",
        message: "product id and variant id are required"
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Cart not found"
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId && item.variantId.toString() === variantId)
    );

    if (cart.items.length === initialLength) {
      return res.status(404).send({
        status: "error",
        message: "Item not found in cart"
      });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();

    return res.status(200).send({
      status: "success",
      message: "Item removed from cart successfully",
      data: cart
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).send({
      status: "error",
      message: "Cannot remove item from cart"
    });
  }
};