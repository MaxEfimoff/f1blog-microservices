import express from 'express';
import { signupValidation } from '../../../validation/signup';
import { loginValidation } from '../../../validation/login';
import { register } from '../../controllers/users/register';
import { activate } from '../../controllers/users/activate';
import { login } from '../../controllers/users/login';
import { current } from '../../controllers/users/current';
import { all } from '../../controllers/users/all';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';

const router = express.Router();

// Shortened for /api/v1/users
router.post('/signup', signupValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.patch('/:hash/activate', activate);
router.get('/current', currentUser, requireAuth, current);
router.get('/all', currentUser, requireAuth, all);

export { router as users };
