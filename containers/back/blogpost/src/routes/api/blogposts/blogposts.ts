import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { blogPostValidation } from '../../../validation/create-blogpost';

import { test } from '../../controllers/blogposts/test';
import { fetchAllBlogPosts } from '../../controllers/blogposts/fetch-all-blogposts';
import { fetchMyBlogPosts } from '../../controllers/blogposts/fetch-my-blogposts';
import { createBlogPost } from '../../controllers/blogposts/create-blogpost';
import { deleteBlogPost } from '../../controllers/blogposts/delete-blogpost';

const router = express.Router();

// Shortened for /api/v1/blogposts
router.get('/test', test);
router.get('/:griupId/', fetchAllBlogPosts);
router.get('/:griupId/my', currentUser, requireAuth, fetchMyBlogPosts);

router.post(
  '/:griupId/',
  currentUser,
  requireAuth,
  blogPostValidation,
  validateRequest,
  createBlogPost,
);

router.delete('/:id', currentUser, requireAuth, deleteBlogPost);

export { router as blogposts };
