import express from 'express';
import { signupValidation } from '../../../validation/signup';
import { loginValidation } from '../../../validation/login';
import { resetPasswordValidation } from '../../../validation/reset-password';
import { register } from '../../controllers/users/register';
import { activate } from '../../controllers/users/activate';
import { login } from '../../controllers/users/login';
import { current } from '../../controllers/users/current';
import { all } from '../../controllers/users/all';
import { resetPassword } from '../../controllers/users/reset-password';
import { hashResetPassword } from '../../controllers/users/hash-reset-password';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/users
router.get('/all', currentUser, requireAuth, all);
router.get('/current', currentUser, requireAuth, current);
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

export { router as users };
