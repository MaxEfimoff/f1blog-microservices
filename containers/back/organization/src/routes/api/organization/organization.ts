import express from "express";
import { validateRequest, currentUser, requireAuth } from "@f1blog/common";
import { test } from "../../controllers/organization/test-check";
import { fetchOrganization } from "../../controllers/organization/fetch-organization";
import { createOrganization } from "../../controllers/organization/create-organization";
import { updateOrganization } from "../../controllers/organization/update-organization";
import { organizationValidation } from "../../../validation/create-organization";

const router = express.Router();

// Shortened for /api/v1/organization
router.get("/test", currentUser, requireAuth, test);
router.get("/", currentUser, requireAuth, fetchOrganization);
router.post(
  "/",
  currentUser,
  requireAuth,
  organizationValidation,
  validateRequest,
  createOrganization
);
router.patch(
  "/:id",
  currentUser,
  requireAuth,
  organizationValidation,
  validateRequest,
  updateOrganization
);

export { router as organization };
