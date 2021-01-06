import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { profileValidation } from '../../../validation/create-profile';
import { updateProfileValidation } from '../../../validation/update-profile';
import { createProfile } from '../../controllers/profiles/create-profile';
import { updateProfile } from '../../controllers/profiles/update-profile';
import { deleteProfile } from '../../controllers/profiles/delete-profile';
import { unsubscribeProfile } from '../../controllers/profiles/unsubsribe-profile';
import { all } from '../../controllers/profiles/all';
import { getProfileByHandle } from '../../controllers/profiles/get-by-handle';
import { getProfileById } from '../../controllers/profiles/get-by-id';
import { test } from '../../controllers/profiles/test-check';
import { current } from '../../controllers/profiles/current';
import { subscribeToProfile } from '../../controllers/profiles/subscribe-to-profile';
import { fetchSubscribedProfiles } from '../../controllers/profiles/fetch-subscribed-profiles';
import { fetchSubscribers } from '../../controllers/profiles/fetch-subscribers';

const router = express.Router();

// Shortened for /api/v1/profiles
router.get('/test', currentUser, requireAuth, test);
router.get('/all', currentUser, requireAuth, all);
router.get('/current', currentUser, requireAuth, current);
router.get('/handle/:handle', currentUser, requireAuth, getProfileByHandle);
router.get(
  '/subscribed-profiles',
  currentUser,
  requireAuth,
  fetchSubscribedProfiles
);
router.get('/subscribers', currentUser, requireAuth, fetchSubscribers);
// This route should be last!!!
router.get('/:id', currentUser, requireAuth, getProfileById);

router.post(
  '/',
  currentUser,
  requireAuth,
  profileValidation,
  validateRequest,
  createProfile
);

router.post('/subscribe/:id', currentUser, requireAuth, subscribeToProfile);

router.patch(
  '/',
  currentUser,
  requireAuth,
  updateProfileValidation,
  validateRequest,
  updateProfile
);
router.patch('/unsubscribe/:id', currentUser, requireAuth, unsubscribeProfile);

router.delete('/', currentUser, requireAuth, deleteProfile);

export { router as profiles };
