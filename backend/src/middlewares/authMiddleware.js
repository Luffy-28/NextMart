import { verifyToken } from "../helpers/tokenHelper.js";
import { User } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({ status: "error", message: "No token" });
    }
    const token = authHeader.split(" ")[1];

    if (token) {
      const tokenData = verifyToken(token);

      const user = await User.findOne({ email: tokenData.email });

      if (user) {
        const { password, ...safeUser } = user.toObject();
        req.user = safeUser;
        next();
      } else {
        return res.status(401).send({
          status: "error",
          message: "Invalid User",
        });
      }
    } else {
      return res.status(401).send({
        status: "error",
        message: "No token",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "error",
      message: "Unauthorized access",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.role.includes("admin")) {
      return res.status(403).send({
        status: "error",
        messgae: "Admin Role required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Unauthorize access",
    });
  }
};
