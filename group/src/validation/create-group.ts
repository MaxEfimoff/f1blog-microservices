import { body } from 'express-validator';

export const groupValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Title should be between 15 and 150 characters'),
];
