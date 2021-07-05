import { body } from "express-validator";

export const organizationValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title should be between 3 and 120 characters"),
  body("website")
    .trim()
    .isLength({ min: 8, max: 120 })
    .withMessage("Website should be between 8 and 120 characters"),
];
