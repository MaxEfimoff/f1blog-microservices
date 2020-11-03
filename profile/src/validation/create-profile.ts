import { body } from 'express-validator';

export const profileValidation = [
  body('handle')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Handle should be between 2 and 10 characters'),
];
