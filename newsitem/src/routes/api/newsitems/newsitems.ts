import express from 'express';
import { test } from '../../controllers/newsitems/test';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/newsitems
router.get('/test', currentUser, requireAuth, test);
// router.get('/all', currentUser, requireAuth, all);
// router.post(
//   '/create-profile',
//   currentUser,
//   requireAuth,
//   profileValidation,
//   validateRequest,
//   createProfile
// );
// router.get('/current', currentUser, requireAuth, current);
// router.post('/login', loginValidation, validateRequest, login);
// router.patch('/:hash/activate', activate);

export { router as newsitems };
