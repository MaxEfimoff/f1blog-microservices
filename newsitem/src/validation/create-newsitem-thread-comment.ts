import { body } from 'express-validator';

export const newsItemThreadCommentValidation = [
  body('text')
    .trim()
    .isLength({ min: 15, max: 400 })
    .withMessage('Text should be between 15 and 400 characters'),
];
