import { body } from 'express-validator';

export const resetPasswordValidation = [
  body('email').exists().isEmail().withMessage('Email must be valid'),
];
