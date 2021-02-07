import { body } from 'express-validator';

export const updateProfileValidation = [
  body('handle')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Handle should be between 2 and 10 characters'),
  body('avatar')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Handle should be between 2 and 10 characters'),
  body('background')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Handle should be between 2 and 10 characters'),
];
