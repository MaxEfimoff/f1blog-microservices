import { body } from 'express-validator';

export const teamValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Title should be between 3 and 30 characters'),
];
