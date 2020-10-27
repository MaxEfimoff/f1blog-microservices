import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { test } from '../../controllers/newsitems/test';
import { createNewsItem } from '../../controllers/newsitems/create-newsitem';
import { newsItemValidation } from '../../../validation/create-newsitem';

const router = express.Router();

// Shortened for /api/v1/newsitems
router.get('/test', currentUser, requireAuth, test);
// router.get('/all', currentUser, requireAuth, all);
router.post(
  '/create-newsitem',
  currentUser,
  requireAuth,
  newsItemValidation,
  validateRequest,
  createNewsItem
);
// router.get('/current', currentUser, requireAuth, current);
// router.post('/login', loginValidation, validateRequest, login);
// router.patch('/:hash/activate', activate);

export { router as newsitems };
