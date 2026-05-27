import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "./src/config/passport.js";
import { configDotenv } from "dotenv";
import { config } from "./src/config/config.js";
import { connectRedis } from "./src/helpers/redisClient.js";
import {
  authLimiter,
  paymentLimiter,
  generalLimiter,
} from "./src/middlewares/rateLimiter.js";
import authRouter from "./src/routers/authRouter.js";
import userRouter from "./src/routers/userRouter.js";
import productRouter from "./src/routers/productRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import subCategoryRouter from "./src/routers/subCategoryRouter.js";
import dealRouter from "./src/routers/dealRouter.js";
import orderRouter from "./src/routers/orderRouter.js";
import paymentRouter from "./src/routers/paymentRouter.js";
import cartRouter from "./src/routers/cartRouter.js";
import reviewRouter from "./src/routers/reviewRouter.js";

// Swagger Imports
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";

configDotenv();

const app = express();
const port = config.port;
const mongourl = config.mongoUrl;

app.use(
  session({
    secret: config.google.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    status: "success",
    message: "Welcome to NextMart Customer API",
  });
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", generalLimiter, userRouter);
app.use("/api/v1/products", generalLimiter, productRouter);
app.use("/api/v1/categories", generalLimiter, categoryRouter);
app.use("/api/v1/subcategories", generalLimiter, subCategoryRouter);
app.use("/api/v1/deals", generalLimiter, dealRouter);
app.use("/api/v1/orders", generalLimiter, orderRouter);
app.use("/api/v1/payments", paymentLimiter, paymentRouter);
app.use("/api/v1/carts", generalLimiter, cartRouter);
app.use("/api/v1/reviews", generalLimiter, reviewRouter);

// Setup Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const startServer = async () => {
  try {
    await mongoose.connect(mongourl);
    console.log("Connected to MongoDB");

    await connectRedis();

    app.listen(port, (error) => {
      if (error) {
        console.log("Error starting server:", error);
      } else {
        console.log(`Server started at port ${port}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
