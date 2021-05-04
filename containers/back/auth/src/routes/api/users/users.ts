import express from 'express';
import { signupValidation } from '../../../validation/signup';
import { loginValidation } from '../../../validation/login';
import { resetPasswordValidation } from '../../../validation/reset-password';
import { register } from '../../controllers/users/register';
import { activate } from '../../controllers/users/activate';
import { login } from '../../controllers/users/login';
import { current } from '../../controllers/users/current';
import { all } from '../../controllers/users/all';
import { resendActivationHash } from '../../controllers/users/resend-activation-hash';
// import { googleOauth } from '../../controllers/users/google-oauth';
// import { googleOauthCallback } from '../../controllers/users/google-oauth-callback';
import { resetPassword } from '../../controllers/users/reset-password';
import { hashResetPassword } from '../../controllers/users/hash-reset-password';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/users
router.get('/all', currentUser, requireAuth, all);
router.get('/current', currentUser, requireAuth, current);
// router.get('/googleoauth', googleOauth);
// router.get('/googleoauth/callback', googleOauthCallback);
router.post('/login', loginValidation, validateRequest, login);
router.post('/signup', signupValidation, validateRequest, register);
router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  resetPassword
);
router.patch('/:hash/activate', activate);
router.patch('/:hash/reset-password', hashResetPassword);
router.patch('/hash/resend', resendActivationHash);

export { router as users };
