import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { config } from "./src/config/config.js";

// Import all models so mongoose registers their collections
import "./src/models/userModel.js";
import "./src/models/categoryModel.js";
import "./src/models/subCategoryModel.js";
import "./src/models/productModel.js";
import "./src/models/dealsModel.js";
import "./src/models/cartModel.js";
import "./src/models/orderModel.js";
import "./src/models/paymentModel.js";
import "./src/models/reviewModel.js";
import "./src/models/wishListModel.js";
import "./src/models/CoupanModel.js";
import "./src/models/addressModel.js";

configDotenv();

const deleteAll = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to MongoDB");

    const collections = mongoose.connection.collections;
    const names = Object.keys(collections);

    for (const name of names) {
      await collections[name].deleteMany({});
      console.log(`Cleared: ${name}`);
    }

    console.log("\nAll collections cleared successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Delete seeder failed:", error);
    process.exit(1);
  }
};

deleteAll();
