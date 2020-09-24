import { body } from 'express-validator';

export const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Name should be between 2 and 20 characters'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password should be between 4 and 20 characters'),
  body('password2')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password should be between 4 and 20 characters')
    .custom((value, { req, path }) => {
      if (value != req.body.password) {
        throw new Error('Passwords should match');
      } else {
        return value;
      }
    }),
];
