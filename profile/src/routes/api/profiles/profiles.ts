import express from 'express';
import { profileValidation } from '../../../validation/create-profile';
import { updateProfileValidation } from '../../../validation/update-profile';
import { createProfile } from '../../controllers/profiles/create-profile';
import { updateProfile } from '../../controllers/profiles/update-profile';
import { deleteProfile } from '../../controllers/profiles/delete-profile';
import { all } from '../../controllers/profiles/all';
import { test } from '../../controllers/profiles/test-check';
import { current } from '../../controllers/profiles/current';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/profiles
router.get('/test', currentUser, requireAuth, test);
router.get('/all', currentUser, requireAuth, all);
router.get('/current', currentUser, requireAuth, current);

router.post(
  '/',
  currentUser,
  requireAuth,
  profileValidation,
  validateRequest,
  createProfile
);

router.patch(
  '/',
  currentUser,
  requireAuth,
  updateProfileValidation,
  validateRequest,
  updateProfile
);

router.delete('/', currentUser, requireAuth, deleteProfile);

export { router as profiles };
