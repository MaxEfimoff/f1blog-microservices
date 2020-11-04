import express from 'express';
import { profileValidation } from '../../../validation/create-profile';
import { updateProfileValidation } from '../../../validation/update-profile';
import { createProfile } from '../../controllers/profiles/create-profile';
import { updateProfile } from '../../controllers/profiles/update-profile';
import { deleteProfile } from '../../controllers/profiles/delete-profile';
import { subscribeProfile } from '../../controllers/profiles/subsribe-profile';
import { unsubscribeProfile } from '../../controllers/profiles/unsubsribe-profile';
import { all } from '../../controllers/profiles/all';
import { getProfileByHandle } from '../../controllers/profiles/get-by-handle';
import { getProfileById } from '../../controllers/profiles/get-by-id';
import { test } from '../../controllers/profiles/test-check';
import { current } from '../../controllers/profiles/current';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/profiles
router.get('/test', currentUser, requireAuth, test);
router.get('/all', currentUser, requireAuth, all);
router.get('/current', currentUser, requireAuth, current);
router.get('/handle/:handle', currentUser, requireAuth, getProfileByHandle);
router.get('/:id', currentUser, requireAuth, getProfileById);

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
router.patch('/subscribe/:id', currentUser, requireAuth, subscribeProfile);
router.patch('/unsubscribe/:id', currentUser, requireAuth, unsubscribeProfile);

router.delete('/', currentUser, requireAuth, deleteProfile);

export { router as profiles };
