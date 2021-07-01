import express from "express";
import { validateRequest, currentUser, requireAuth } from "@f1blog/common";
import { test } from "../../controllers/organization/test";

const router = express.Router();

// Shortened for /api/v1/organization
router.get("/test", test);

export { router as organization };
