import express from 'express';
import { profileValidation } from '../../../validation/create-profile';
import { createProfile } from '../../controllers/profiles/create-profile';
import { all } from '../../controllers/profiles/all';
import { test } from '../../controllers/profiles/test-check';
import { current } from '../../controllers/profiles/current';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/profiles
router.get('/test', currentUser, requireAuth, test);
router.get('/all', currentUser, requireAuth, all);
router.post(
  '/create-profile',
  currentUser,
  requireAuth,
  profileValidation,
  validateRequest,
  createProfile
);
router.get('/current', currentUser, requireAuth, current);
// router.post('/login', loginValidation, validateRequest, login);
// router.patch('/:hash/activate', activate);

export { router as profiles };
