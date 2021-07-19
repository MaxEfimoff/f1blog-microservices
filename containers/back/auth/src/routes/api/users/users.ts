import express from 'express';
import { signupValidation } from '../../../validation/signup';
import { loginValidation } from '../../../validation/login';
import { resetPasswordValidation } from '../../../validation/reset-password';
import { resetEmailValidation } from '../../../validation/reset-email';
// import { googleOauth } from '../../controllers/users/google-oauth';
// import { googleOauthCallback } from '../../controllers/users/google-oauth-callback';
import { register } from '../../controllers/users/register-user';
import { activate } from '../../controllers/users/activate-user';
import { login } from '../../controllers/users/login-user';
import { current } from '../../controllers/users/current-user';
import { allUsers } from '../../controllers/users/all-users';
import { resendActivationHash } from '../../controllers/users/resend-activation-hash';
import { restorePasswordRequest } from '../../controllers/users/restore-password-request';
import { changeEmailRequest } from '../../controllers/users/change-email-request';
import { hashResetPassword } from '../../controllers/users/hash-restored-password';
import { hashChangeEmail } from '../../controllers/users/hash-changed-email';
import { allResetPasswordHashes } from '../../controllers/users/all-reset-password-hashes';
import { allConfirmationHashes } from '../../controllers/users/all-confirmation-hashes';
import { allChangeEmailHashes } from '../../controllers/users/all-change-email-hashes';
import { allUserRoles } from '../../controllers/users/all-user-roles';
import { fetchUsersByUserrole } from '../../controllers/users/fetch-users-by-role';
import { createUserRole } from '../../controllers/users/create-user-role';
import { assignRoleToUser } from '../../controllers/users/assign-role-to-user';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/users
// router.get('/googleoauth', googleOauth);
// router.get('/googleoauth/callback', googleOauthCallback);
router.get('/all', currentUser, requireAuth, allUsers);
router.get('/current', currentUser, requireAuth, current);
router.get('/all-reset-password-hashes', allResetPasswordHashes);
router.get('/all-confirmation-hashes', allConfirmationHashes);
router.get('/all-change-email-hashes', allChangeEmailHashes);
router.get('/all-user-roles', allUserRoles);
router.get('/user-role-by-value/:role', fetchUsersByUserrole);
router.post('/login', loginValidation, validateRequest, login);
router.post('/signup', signupValidation, validateRequest, register);
router.post('/:id/assign-role-to-user/:role', assignRoleToUser);
router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  restorePasswordRequest
);
router.post('/change-email', currentUser, requireAuth, changeEmailRequest);
router.post('/create-user-role', currentUser, requireAuth, createUserRole);
router.patch('/:hash/activate', activate);
router.patch('/:hash/reset-password', hashResetPassword);
router.patch(
  '/:hash/change-email',
  resetEmailValidation,
  validateRequest,
  currentUser,
  requireAuth,
  hashChangeEmail
);
router.patch('/hash/resend', resendActivationHash);

export { router as users };
