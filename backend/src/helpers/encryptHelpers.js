import bcrypt from "bcrypt";
import { config } from "../config/config.js";

export const hashPassword = (plainData) => {
  const encryptedData = bcrypt.hashSync(plainData, config.salt);

  return encryptedData;
};

export const compareData = (plainData, encryptedData) => {
  const compared = bcrypt.compareSync(plainData, encryptedData);

  return compared;
};
