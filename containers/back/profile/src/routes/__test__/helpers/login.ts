import jsonwebtoken from "jsonwebtoken";
import { app } from "../../../app";

export const login = async (id: string = "1") => {
  const payload = {
    id: id,
    name: "max",
  };

  // Sign the jsonwebtoken token
  const authToken =
    "Bearer " +
    jsonwebtoken.sign(payload, process.env.JWT_KEY!, {
      expiresIn: 604800,
    });

  return authToken;
};
