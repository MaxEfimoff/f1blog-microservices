import express from 'express';
import { signupValidation } from '../../../validation/signup';
import { loginValidation } from '../../../validation/login';
import { resetPasswordValidation } from '../../../validation/reset-password';
import { register } from '../../controllers/users/register-user';
import { activate } from '../../controllers/users/activate-user';
import { login } from '../../controllers/users/login-user';
import { current } from '../../controllers/users/current-user';
import { allUsers } from '../../controllers/users/all-users';
import { resendActivationHash } from '../../controllers/users/resend-activation-hash';
// import { googleOauth } from '../../controllers/users/google-oauth';
// import { googleOauthCallback } from '../../controllers/users/google-oauth-callback';
import { restorePasswordRequest } from '../../controllers/users/restore-password-request';
import { hashResetPassword } from '../../controllers/users/hash-restored-password';
import { allResetPasswordHashes } from '../../controllers/users/all-reset-password-hashes';
import { allConfirmationHashes } from '../../controllers/users/all-confirmation-hashes';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/users
router.get('/all', currentUser, requireAuth, allUsers);
router.get('/current', currentUser, requireAuth, current);
router.get('/all-reset-password-hashes', allResetPasswordHashes);
router.get('/all-confirmation-hashes', allConfirmationHashes);
// router.get('/googleoauth', googleOauth);
// router.get('/googleoauth/callback', googleOauthCallback);
router.post('/login', loginValidation, validateRequest, login);
router.post('/signup', signupValidation, validateRequest, register);
router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  restorePasswordRequest
);
router.patch('/:hash/activate', activate);
router.patch('/:hash/reset-password', hashResetPassword);
router.patch('/hash/resend', resendActivationHash);

export { router as users };
