import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { Category } from "./src/models/categoryModel.js";
import { SubCategory } from "./src/models/subCategoryModel.js";
import { config } from "./src/config/config.js";

configDotenv();

const data = [
  {
    name: "Electronics",
    image: "https://picsum.photos/seed/electronics/400/300",
    subCategories: ["Smartphones", "Laptops", "Tablets", "Accessories"],
  },
  {
    name: "Clothing",
    image: "https://picsum.photos/seed/clothing/400/300",
    subCategories: ["Men's Wear", "Women's Wear", "Kids' Wear", "Sportswear"],
  },
  {
    name: "Home & Kitchen",
    image: "https://picsum.photos/seed/home/400/300",
    subCategories: ["Cookware", "Furniture", "Bedding", "Home Decor"],
  },
  {
    name: "Sports & Outdoors",
    image: "https://picsum.photos/seed/sports/400/300",
    subCategories: ["Fitness Equipment", "Outdoor Gear", "Team Sports", "Water Sports"],
  },
  {
    name: "Books",
    image: "https://picsum.photos/seed/books/400/300",
    subCategories: ["Fiction", "Non-Fiction", "Academic", "Children's Books"],
  },
  {
    name: "Beauty & Personal Care",
    image: "https://picsum.photos/seed/beauty/400/300",
    subCategories: ["Skincare", "Haircare", "Makeup", "Fragrances"],
  },
  {
    name: "Toys & Games",
    image: "https://picsum.photos/seed/toys/400/300",
    subCategories: ["Action Figures", "Board Games", "Educational Toys", "Outdoor Toys"],
  },
  {
    name: "Food & Grocery",
    image: "https://picsum.photos/seed/food/400/300",
    subCategories: ["Snacks", "Beverages", "Organic", "Dairy Products"],
  },
  {
    name: "Automotive",
    image: "https://picsum.photos/seed/automotive/400/300",
    subCategories: ["Car Accessories", "Tools & Equipment", "Car Care", "Spare Parts"],
  },
  {
    name: "Health & Wellness",
    image: "https://picsum.photos/seed/health/400/300",
    subCategories: ["Vitamins & Supplements", "Medical Devices", "Fitness", "Mental Wellness"],
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to MongoDB for seeding");

    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    console.log("Cleared existing categories and subcategories");

    for (const item of data) {
      const category = new Category({ name: item.name, image: item.image });
      await category.save();

      for (const subName of item.subCategories) {
        const sub = new SubCategory({ name: subName, category: category._id });
        await sub.save();
      }

      console.log(`Seeded: ${item.name} with ${item.subCategories.length} subcategories`);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();
