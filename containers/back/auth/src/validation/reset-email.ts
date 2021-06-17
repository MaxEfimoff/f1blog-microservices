import { body } from 'express-validator';

export const resetEmailValidation = [
  body('email').exists().isEmail().withMessage('Email must be valid'),
];
