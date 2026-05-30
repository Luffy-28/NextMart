import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { Category } from "./src/models/categoryModel.js";
import { SubCategory } from "./src/models/subCategoryModel.js";
import Product from "./src/models/productModel.js";
import { Deal } from "./src/models/dealsModel.js";
import { config } from "./src/config/config.js";

configDotenv();

// ─── CATEGORY + SUBCATEGORY DATA ────────────────────────────────────────────

const categoryData = [
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

// ─── PRODUCT TEMPLATES (categoryName + subCategoryName resolved to IDs) ─────

const productTemplates = [
  // Electronics
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "The ultimate Galaxy experience with a built-in S Pen, 200MP camera, and AI-powered features for productivity and creativity.",
    categoryName: "Electronics", subCategoryName: "Smartphones",
    brand: "Samsung", basePrice: 1299, discountedPrice: 1099,
    stock: 45, color: "Titanium Gray",
    tags: ["featured", "new", "bestseller"],
    images: ["https://picsum.photos/seed/galaxy-s24/800/600"],
    featured: true, rating: 4.8, reviewCount: 312,
    metaTitle: "Samsung Galaxy S24 Ultra — Buy Now",
    metaDescription: "Get the Samsung Galaxy S24 Ultra at the best price. 200MP camera, S Pen, and AI features.",
  },
  {
    name: "Apple MacBook Air M3",
    description: "Supercharged by M3, the all-day battery MacBook Air is thinner than ever and blazingly fast for any workflow.",
    categoryName: "Electronics", subCategoryName: "Laptops",
    brand: "Apple", basePrice: 1499, discountedPrice: 1349,
    stock: 30, color: "Midnight",
    tags: ["featured", "new"],
    images: ["https://picsum.photos/seed/macbook-air/800/600"],
    featured: true, rating: 4.9, reviewCount: 205,
    metaTitle: "Apple MacBook Air M3 — Buy Now",
    metaDescription: "MacBook Air with M3 chip. Incredibly fast, fanless design, and all-day battery.",
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "The ultimate iPad experience with the M2 chip, ProMotion XDR display, and support for Apple Pencil and Magic Keyboard.",
    categoryName: "Electronics", subCategoryName: "Tablets",
    brand: "Apple", basePrice: 1099, discountedPrice: 999,
    stock: 25, color: "Space Gray",
    tags: ["new", "sale"],
    images: ["https://picsum.photos/seed/ipad-pro/800/600"],
    featured: false, rating: 4.7, reviewCount: 178,
    metaTitle: "iPad Pro 12.9-inch — Buy Now",
    metaDescription: "iPad Pro with M2 chip and ProMotion XDR display. The most powerful iPad ever.",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancelling headphones with 30-hour battery, multipoint connection, and crystal-clear call quality.",
    categoryName: "Electronics", subCategoryName: "Accessories",
    brand: "Sony", basePrice: 399, discountedPrice: 299,
    stock: 80, color: "Black",
    tags: ["sale", "bestseller"],
    images: ["https://picsum.photos/seed/sony-xm5/800/600"],
    featured: true, rating: 4.8, reviewCount: 489,
    metaTitle: "Sony WH-1000XM5 Headphones — Buy Now",
    metaDescription: "Best-in-class noise cancelling headphones. 30-hour battery and crystal-clear calls.",
  },
  {
    name: "Anker Wireless Charging Pad",
    description: "15W fast wireless charging pad compatible with iPhone and Android devices. Slim, portable, with LED indicator.",
    categoryName: "Electronics", subCategoryName: "Accessories",
    brand: "Anker", basePrice: 45, discountedPrice: 35,
    stock: 150, color: "Black",
    tags: ["new", "sale"],
    images: ["https://picsum.photos/seed/anker-charger/800/600"],
    featured: false, rating: 4.5, reviewCount: 621,
    metaTitle: "Anker Wireless Charging Pad — Buy Now",
    metaDescription: "15W fast wireless charging pad, compatible with all Qi devices.",
  },

  // Clothing
  {
    name: "Classic Slim-Fit Chinos",
    description: "Premium slim-fit chinos crafted from stretch cotton blend. Perfect for work or weekend wear, available in multiple colours.",
    categoryName: "Clothing", subCategoryName: "Men's Wear",
    brand: "Levi's", basePrice: 79, discountedPrice: 59,
    stock: 120, color: "Navy", size: "M",
    tags: ["sale", "trending"],
    images: ["https://picsum.photos/seed/chinos/800/600"],
    featured: false, rating: 4.3, reviewCount: 94,
    metaTitle: "Classic Slim-Fit Chinos — Buy Now",
    metaDescription: "Premium stretch slim-fit chinos. Versatile style for any occasion.",
  },
  {
    name: "Floral Wrap Midi Dress",
    description: "Elegant floral wrap dress with adjustable tie waist and flutter sleeves. Lightweight viscose fabric ideal for any season.",
    categoryName: "Clothing", subCategoryName: "Women's Wear",
    brand: "Zara", basePrice: 89, discountedPrice: 69,
    stock: 75, color: "Floral Print", size: "S",
    tags: ["trending", "new"],
    images: ["https://picsum.photos/seed/wrap-dress/800/600"],
    featured: false, rating: 4.4, reviewCount: 156,
    metaTitle: "Floral Wrap Midi Dress — Buy Now",
    metaDescription: "Lightweight floral wrap dress with adjustable waist. Perfect for any season.",
  },
  {
    name: "Kids Denim Jacket",
    description: "Durable classic denim jacket for kids with button-up front, chest pockets, and a slightly oversized fit for easy layering.",
    categoryName: "Clothing", subCategoryName: "Kids' Wear",
    brand: "H&M", basePrice: 49, discountedPrice: 39,
    stock: 60, color: "Blue", size: "M",
    tags: ["new"],
    images: ["https://picsum.photos/seed/kids-denim/800/600"],
    featured: false, rating: 4.2, reviewCount: 43,
    metaTitle: "Kids Denim Jacket — Buy Now",
    metaDescription: "Classic denim jacket for kids. Durable, stylish, and easy to layer.",
  },
  {
    name: "Performance Running Shorts",
    description: "Lightweight 5-inch running shorts with moisture-wicking fabric, built-in liner, and zip back pocket for your essentials.",
    categoryName: "Clothing", subCategoryName: "Sportswear",
    brand: "Nike", basePrice: 55, discountedPrice: 45,
    stock: 200, color: "Black", size: "L",
    tags: ["featured", "bestseller"],
    images: ["https://picsum.photos/seed/running-shorts/800/600"],
    featured: true, rating: 4.6, reviewCount: 287,
    metaTitle: "Nike Performance Running Shorts — Buy Now",
    metaDescription: "Lightweight moisture-wicking running shorts with built-in liner.",
  },

  // Home & Kitchen
  {
    name: "Non-Stick Cookware Set 10-Piece",
    description: "Premium non-stick cookware set including fry pans, saucepans, and a stockpot. Dishwasher safe and oven safe to 220°C.",
    categoryName: "Home & Kitchen", subCategoryName: "Cookware",
    brand: "Tefal", basePrice: 149, discountedPrice: 119,
    stock: 40, color: "Graphite",
    tags: ["sale", "bestseller"],
    images: ["https://picsum.photos/seed/cookware/800/600"],
    featured: false, rating: 4.5, reviewCount: 372,
    metaTitle: "Tefal Non-Stick Cookware Set 10-Piece — Buy Now",
    metaDescription: "Premium 10-piece non-stick cookware set. Dishwasher and oven safe.",
  },
  {
    name: "Ergonomic Mesh Office Chair",
    description: "High-back ergonomic office chair with lumbar support, adjustable armrests, breathable mesh back, and 5-star swivel base.",
    categoryName: "Home & Kitchen", subCategoryName: "Furniture",
    brand: "Secretlab", basePrice: 499, discountedPrice: 399,
    stock: 20, color: "Black",
    tags: ["featured", "trending"],
    images: ["https://picsum.photos/seed/office-chair/800/600"],
    featured: true, rating: 4.7, reviewCount: 198,
    metaTitle: "Ergonomic Mesh Office Chair — Buy Now",
    metaDescription: "High-back ergonomic chair with lumbar support and breathable mesh back.",
  },
  {
    name: "Egyptian Cotton Duvet Cover Set",
    description: "Luxurious 1000-thread-count Egyptian cotton duvet cover with two pillowcases. Silky smooth and cool for all seasons.",
    categoryName: "Home & Kitchen", subCategoryName: "Bedding",
    brand: "Sheridan", basePrice: 199, discountedPrice: 159,
    stock: 55, color: "Ivory", size: "Queen",
    tags: ["sale", "new"],
    images: ["https://picsum.photos/seed/duvet/800/600"],
    featured: false, rating: 4.6, reviewCount: 134,
    metaTitle: "Egyptian Cotton Duvet Cover Set — Buy Now",
    metaDescription: "1000TC Egyptian cotton duvet set. Silky smooth and thermoregulating.",
  },
  {
    name: "Minimalist Concrete Table Lamp",
    description: "Modern minimalist table lamp with a hand-cast concrete base and linen drum shade. E27 bulb socket, perfect for any room.",
    categoryName: "Home & Kitchen", subCategoryName: "Home Decor",
    brand: "IKEA", basePrice: 69, discountedPrice: 49,
    stock: 90, color: "Grey",
    tags: ["trending", "new"],
    images: ["https://picsum.photos/seed/table-lamp/800/600"],
    featured: false, rating: 4.3, reviewCount: 67,
    metaTitle: "Minimalist Concrete Table Lamp — Buy Now",
    metaDescription: "Hand-cast concrete table lamp with linen drum shade. Modern and elegant.",
  },

  // Sports & Outdoors
  {
    name: "Adjustable Dumbbell Set 40kg",
    description: "Space-saving adjustable dumbbell set replacing 15 pairs of traditional dumbbells. Quick-change dial system, 2.5kg–40kg range.",
    categoryName: "Sports & Outdoors", subCategoryName: "Fitness Equipment",
    brand: "Bowflex", basePrice: 299, discountedPrice: 249,
    stock: 35, color: "Black",
    tags: ["featured", "bestseller"],
    images: ["https://picsum.photos/seed/dumbbells/800/600"],
    featured: true, rating: 4.8, reviewCount: 421,
    metaTitle: "Adjustable Dumbbell Set 40kg — Buy Now",
    metaDescription: "Replaces 15 pairs of dumbbells. Quick-change dial, 2.5kg–40kg range.",
  },
  {
    name: "4-Person Camping Tent",
    description: "Weatherproof 4-season tent for 4 people with fibreglass poles, rain fly, two doors, and vestibules for gear storage.",
    categoryName: "Sports & Outdoors", subCategoryName: "Outdoor Gear",
    brand: "Coleman", basePrice: 189, discountedPrice: 149,
    stock: 28, color: "Green",
    tags: ["sale", "trending"],
    images: ["https://picsum.photos/seed/camping-tent/800/600"],
    featured: true, rating: 4.5, reviewCount: 189,
    metaTitle: "Coleman 4-Person Camping Tent — Buy Now",
    metaDescription: "Weatherproof 4-season tent for 4. Easy setup with two doors and vestibules.",
  },
  {
    name: "Premium Yoga Mat 6mm",
    description: "Eco-friendly natural rubber yoga mat with alignment lines, non-slip surface, and carrying strap. Suitable for all yoga styles.",
    categoryName: "Sports & Outdoors", subCategoryName: "Fitness Equipment",
    brand: "Lululemon", basePrice: 89, discountedPrice: 75,
    stock: 110, color: "Midnight Blue",
    tags: ["new", "featured"],
    images: ["https://picsum.photos/seed/yoga-mat/800/600"],
    featured: true, rating: 4.7, reviewCount: 334,
    metaTitle: "Lululemon Premium Yoga Mat 6mm — Buy Now",
    metaDescription: "Eco-friendly natural rubber yoga mat with alignment lines and non-slip surface.",
  },

  // Books
  {
    name: "Atomic Habits",
    description: "James Clear's international bestseller on how tiny changes in behaviour lead to remarkable results. Over 15 million copies sold.",
    categoryName: "Books", subCategoryName: "Non-Fiction",
    brand: "Random House", basePrice: 25, discountedPrice: 19,
    stock: 500, color: "Paperback",
    tags: ["featured", "bestseller"],
    images: ["https://picsum.photos/seed/atomic-habits/800/600"],
    featured: true, rating: 4.9, reviewCount: 8921,
    metaTitle: "Atomic Habits by James Clear — Buy Now",
    metaDescription: "The #1 New York Times bestseller. Tiny changes, remarkable results.",
  },
  {
    name: "Introduction to Algorithms (4th Edition)",
    description: "The definitive reference for algorithm design and analysis, covering sorting, graph algorithms, dynamic programming, and more.",
    categoryName: "Books", subCategoryName: "Academic",
    brand: "MIT Press", basePrice: 79, discountedPrice: 65,
    stock: 80, color: "Hardcover",
    tags: ["bestseller"],
    images: ["https://picsum.photos/seed/algorithms-book/800/600"],
    featured: false, rating: 4.7, reviewCount: 2340,
    metaTitle: "Introduction to Algorithms 4th Ed — Buy Now",
    metaDescription: "The definitive algorithms reference by Cormen, Leiserson, Rivest, and Stein.",
  },
  {
    name: "The Great Gatsby",
    description: "F. Scott Fitzgerald's timeless novel of ambition, wealth, and love in the Jazz Age. A staple of American literature.",
    categoryName: "Books", subCategoryName: "Fiction",
    brand: "Penguin Classics", basePrice: 15, discountedPrice: 12,
    stock: 300, color: "Paperback",
    tags: ["trending"],
    images: ["https://picsum.photos/seed/great-gatsby/800/600"],
    featured: false, rating: 4.4, reviewCount: 1567,
    metaTitle: "The Great Gatsby by F. Scott Fitzgerald — Buy Now",
    metaDescription: "Fitzgerald's iconic novel of the American Dream. Penguin Classics edition.",
  },

  // Beauty & Personal Care
  {
    name: "Vitamin C Brightening Serum 30ml",
    description: "Stabilised 15% Vitamin C serum with hyaluronic acid and niacinamide. Fades dark spots, boosts collagen, and evens skin tone.",
    categoryName: "Beauty & Personal Care", subCategoryName: "Skincare",
    brand: "The Ordinary", basePrice: 35, discountedPrice: 29,
    stock: 200, color: "Clear",
    tags: ["featured", "bestseller", "new"],
    images: ["https://picsum.photos/seed/vitamin-c-serum/800/600"],
    featured: true, rating: 4.6, reviewCount: 1423,
    metaTitle: "Vitamin C Brightening Serum 30ml — Buy Now",
    metaDescription: "15% stabilised Vitamin C serum with hyaluronic acid. Fade spots and even skin tone.",
  },
  {
    name: "Argan Oil Deep Repair Hair Mask",
    description: "Intensive repair hair mask with 100% pure Moroccan argan oil. Restores shine, reduces frizz, and strengthens brittle hair.",
    categoryName: "Beauty & Personal Care", subCategoryName: "Haircare",
    brand: "Moroccanoil", basePrice: 45, discountedPrice: 39,
    stock: 140, color: "Amber",
    tags: ["bestseller"],
    images: ["https://picsum.photos/seed/hair-mask/800/600"],
    featured: false, rating: 4.5, reviewCount: 687,
    metaTitle: "Moroccanoil Deep Repair Hair Mask — Buy Now",
    metaDescription: "Intensive argan oil hair mask. Restores shine and reduces frizz.",
  },

  // Toys & Games
  {
    name: "LEGO Technic Bugatti Chiron",
    description: "Iconic 1:8 scale LEGO Technic replica of the Bugatti Chiron with working pistons, gearbox, and detailed interior. 3,599 pieces.",
    categoryName: "Toys & Games", subCategoryName: "Action Figures",
    brand: "LEGO", basePrice: 349, discountedPrice: 299,
    stock: 22, color: "Blue & Black",
    tags: ["featured", "limited edition"],
    images: ["https://picsum.photos/seed/lego-bugatti/800/600"],
    featured: true, rating: 4.9, reviewCount: 512,
    metaTitle: "LEGO Technic Bugatti Chiron — Buy Now",
    metaDescription: "1:8 scale LEGO Technic Bugatti Chiron. 3,599 pieces with working gearbox.",
  },
  {
    name: "Catan Board Game",
    description: "The award-winning strategy game of resource collection and trading. For 3–4 players, ages 10+. A modern board game classic.",
    categoryName: "Toys & Games", subCategoryName: "Board Games",
    brand: "Catan Studio", basePrice: 59, discountedPrice: 49,
    stock: 65, color: "Multi",
    tags: ["bestseller", "trending"],
    images: ["https://picsum.photos/seed/catan/800/600"],
    featured: false, rating: 4.7, reviewCount: 2189,
    metaTitle: "Catan Board Game — Buy Now",
    metaDescription: "Award-winning strategy board game for 3–4 players. A modern classic.",
  },

  // Food & Grocery
  {
    name: "Organic Green Tea 100 Bags",
    description: "Premium Japanese whole-leaf green tea in biodegradable bags. Rich in antioxidants with a smooth, fresh taste. Certified organic.",
    categoryName: "Food & Grocery", subCategoryName: "Organic",
    brand: "Twinings", basePrice: 19, discountedPrice: 15,
    stock: 400, color: "Green",
    tags: ["new", "trending"],
    images: ["https://picsum.photos/seed/green-tea/800/600"],
    featured: false, rating: 4.5, reviewCount: 843,
    metaTitle: "Organic Green Tea 100 Bags — Buy Now",
    metaDescription: "Premium organic Japanese green tea. Biodegradable bags, rich in antioxidants.",
  },
  {
    name: "Mixed Nuts & Dried Fruits 500g",
    description: "Gourmet blend of almonds, cashews, walnuts, cranberries, and raisins. No added sugar or preservatives. Great for snacking.",
    categoryName: "Food & Grocery", subCategoryName: "Snacks",
    brand: "Nutty Delights", basePrice: 22, discountedPrice: 18,
    stock: 250, color: "Natural",
    tags: ["bestseller"],
    images: ["https://picsum.photos/seed/mixed-nuts/800/600"],
    featured: false, rating: 4.4, reviewCount: 392,
    metaTitle: "Mixed Nuts & Dried Fruits 500g — Buy Now",
    metaDescription: "Gourmet nut and dried fruit blend. No added sugar or preservatives.",
  },

  // Automotive
  {
    name: "Garmin Dash Cam 4K",
    description: "4K ultra-HD dash cam with GPS, driver alerts, automatic incident detection, and 180° wide-angle lens. Includes 32GB card.",
    categoryName: "Automotive", subCategoryName: "Car Accessories",
    brand: "Garmin", basePrice: 199, discountedPrice: 169,
    stock: 45, color: "Black",
    tags: ["featured", "new"],
    images: ["https://picsum.photos/seed/dash-cam/800/600"],
    featured: true, rating: 4.6, reviewCount: 278,
    metaTitle: "Garmin 4K Dash Cam — Buy Now",
    metaDescription: "4K dash cam with GPS and automatic incident detection. Includes 32GB card.",
  },
  {
    name: "Professional Torque Wrench Set",
    description: "1/2-inch drive torque wrench set with 72-tooth ratchet and range 10–150 Nm. Includes 20-piece socket set and carry case.",
    categoryName: "Automotive", subCategoryName: "Tools & Equipment",
    brand: "Stanley", basePrice: 89, discountedPrice: 75,
    stock: 60, color: "Chrome",
    tags: ["sale"],
    images: ["https://picsum.photos/seed/torque-wrench/800/600"],
    featured: false, rating: 4.5, reviewCount: 167,
    metaTitle: "Professional Torque Wrench Set — Buy Now",
    metaDescription: "1/2-inch drive torque wrench with 20-piece socket set and carry case.",
  },

  // Health & Wellness
  {
    name: "Whey Protein Powder 2kg — Chocolate",
    description: "Gold Standard 100% Whey with 24g of protein per serving, 5.5g BCAAs, and less than 1g of sugar. Mixes instantly.",
    categoryName: "Health & Wellness", subCategoryName: "Vitamins & Supplements",
    brand: "Optimum Nutrition", basePrice: 79, discountedPrice: 65,
    stock: 180, color: "Chocolate",
    tags: ["bestseller", "featured"],
    images: ["https://picsum.photos/seed/whey-protein/800/600"],
    featured: true, rating: 4.8, reviewCount: 3456,
    metaTitle: "Whey Protein Powder 2kg Chocolate — Buy Now",
    metaDescription: "Gold Standard 100% Whey. 24g protein per serving, instant mixing.",
  },
  {
    name: "Omron Digital Blood Pressure Monitor",
    description: "Clinically validated upper arm blood pressure monitor with irregular heartbeat detection, 60-reading memory, and dual-user mode.",
    categoryName: "Health & Wellness", subCategoryName: "Medical Devices",
    brand: "Omron", basePrice: 89, discountedPrice: 75,
    stock: 70, color: "White",
    tags: ["featured", "new"],
    images: ["https://picsum.photos/seed/bp-monitor/800/600"],
    featured: true, rating: 4.7, reviewCount: 921,
    metaTitle: "Omron Digital Blood Pressure Monitor — Buy Now",
    metaDescription: "Clinically validated BP monitor with irregular heartbeat detection.",
  },
];

// ─── DEAL TEMPLATES ──────────────────────────────────────────────────────────

const dealTemplates = [
  {
    title: "Summer Electronics Sale",
    description: "Up to 20% off on top electronics — grab the latest gadgets before stock runs out.",
    bannerImage: "https://picsum.photos/seed/electronics-deal/1200/400",
    discountType: "percentage",
    discountValue: 20,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    productNames: ["Samsung Galaxy S24 Ultra", "Apple MacBook Air M3", "Sony WH-1000XM5 Headphones"],
  },
  {
    title: "Fashion Week Blowout",
    description: "30% off on selected clothing — refresh your wardrobe this season.",
    bannerImage: "https://picsum.photos/seed/fashion-deal/1200/400",
    discountType: "percentage",
    discountValue: 30,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true,
    productNames: ["Classic Slim-Fit Chinos", "Floral Wrap Midi Dress", "Performance Running Shorts"],
  },
  {
    title: "$50 Off Home Makeover",
    description: "Save $50 instantly on selected furniture and cookware to transform your home.",
    bannerImage: "https://picsum.photos/seed/home-deal/1200/400",
    discountType: "fixed",
    discountValue: 50,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    productNames: ["Ergonomic Mesh Office Chair", "Non-Stick Cookware Set 10-Piece"],
  },
  {
    title: "Health & Fitness Special",
    description: "15% off on supplements, fitness gear, and medical devices — invest in your wellbeing.",
    bannerImage: "https://picsum.photos/seed/health-deal/1200/400",
    discountType: "percentage",
    discountValue: 15,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    isActive: true,
    productNames: ["Whey Protein Powder 2kg — Chocolate", "Premium Yoga Mat 6mm", "Omron Digital Blood Pressure Monitor"],
  },
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to MongoDB for seeding\n");

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      Product.deleteMany({}),
      Deal.deleteMany({}),
    ]);
    console.log("Cleared: categories, subcategories, products, deals\n");

    // Seed categories and subcategories, build lookup map
    const categoryMap = {}; // { "Electronics": { id, subs: { "Smartphones": id } } }

    for (const item of categoryData) {
      const category = new Category({ name: item.name, image: item.image });
      await category.save();

      categoryMap[item.name] = { id: category._id, subs: {} };

      for (const subName of item.subCategories) {
        const sub = new SubCategory({ name: subName, category: category._id });
        await sub.save();
        categoryMap[item.name].subs[subName] = sub._id;
      }

      console.log(`Seeded category: ${item.name} (${item.subCategories.length} subcategories)`);
    }

    // Seed products using resolved IDs
    const productDocs = [];

    for (const tmpl of productTemplates) {
      const { categoryName, subCategoryName, ...fields } = tmpl;
      const catEntry = categoryMap[categoryName];

      if (!catEntry) {
        console.warn(`  Skipping product "${tmpl.name}" — unknown category "${categoryName}"`);
        continue;
      }

      const slug = tmpl.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      productDocs.push({
        ...fields,
        slug,
        category: catEntry.id,
        subCategory: subCategoryName ? catEntry.subs[subCategoryName] : undefined,
      });
    }

    const insertedProducts = await Product.insertMany(productDocs);
    console.log(`\nSeeded ${insertedProducts.length} products`);

    // Build product name → _id map for deals
    const productIdMap = {};
    for (const p of insertedProducts) {
      productIdMap[p.name] = p._id;
    }

    // Seed deals using resolved product IDs
    const dealDocs = dealTemplates.map(({ productNames, ...fields }) => ({
      ...fields,
      products: productNames
        .map((name) => productIdMap[name])
        .filter(Boolean),
    }));

    await Deal.insertMany(dealDocs);
    console.log(`Seeded ${dealDocs.length} deals`);

    console.log("\nSeeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
