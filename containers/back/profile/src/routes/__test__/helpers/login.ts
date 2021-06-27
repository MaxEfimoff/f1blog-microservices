import jsonwebtoken from "jsonwebtoken";
import { app } from "../../../app";

export const login = async () => {
  const payload = {
    id: "5f92bdf7588d530018595a09",
    name: "Max",
  };

  // Sign the jsonwebtoken token
  const authToken =
    "Bearer " +
    jsonwebtoken.sign(payload, process.env.JWT_KEY!, {
      expiresIn: 604800,
    });

  return authToken;
};
