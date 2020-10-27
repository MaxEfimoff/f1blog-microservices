import { body } from 'express-validator';

export const newsItemValidation = [
  body('title')
    .trim()
    .isLength({ min: 15, max: 150 })
    .withMessage('Title should be between 15 and 150 characters'),
  body('text')
    .trim()
    .isLength({ min: 150, max: 1500 })
    .withMessage('Text should be between 150 and 1500 characters'),
];
