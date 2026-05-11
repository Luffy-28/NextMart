import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Product from "./src/models/productModel.js";
import { config } from "./src/config/config.js";

configDotenv();

const seedProducts = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to MongoDB for Seeding");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const dummyCategoryId = new mongoose.Types.ObjectId();

    const products = [];
    
    const categories = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books"];
    const tagsOptions = [["sale", "new"], ["bestseller"], ["limited edition"], ["trending"], ["featured", "new"]];

    for (let i = 1; i <= 20; i++) {
      const name = `Awesome Product ${i}`;
      products.push({
        name,
        slug: name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        description: `This is the detailed description for Awesome Product ${i}. It features incredible build quality and excellent value for money.`,
        category: dummyCategoryId,
        brand: `Brand ${Math.ceil(i / 4)}`,
        basePrice: Math.floor(Math.random() * 500) + 50,
        variants: [
          {
            color: ["Red", "Blue", "Black", "White"][i % 4],
            size: ["S", "M", "L", "XL"][i % 4],
            sku: `SKU-${i}001`,
            price: Math.floor(Math.random() * 500) + 50,
            quantity: Math.floor(Math.random() * 100) + 10,
          }
        ],
        tags: tagsOptions[i % 5],
        images: [`https://picsum.photos/seed/${i}/800/600`],
        featured: i % 3 === 0,
        isActive: true,
        rating: Math.floor(Math.random() * 5) + 1,
        reviewCount: Math.floor(Math.random() * 200),
        metaTitle: `Awesome Product ${i} - Buy Now`,
        metaDescription: `Get the best deal on Awesome Product ${i}. Limited stock available.`
      });
    }

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedProducts();
