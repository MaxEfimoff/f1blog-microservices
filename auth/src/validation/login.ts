import { body } from 'express-validator';

export const loginValidation = [
  body('email').exists().isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .exists()
    .withMessage('You should provide the password'),
];
