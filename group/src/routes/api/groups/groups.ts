import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { groupValidation } from '../../../validation/create-group';

import { test } from '../../controllers/groups/test';
import { fetchAllGroups } from '../../controllers/groups/fetch-all-groups';
import { fetchMyGroups } from '../../controllers/groups/fetch-my-groups';
import { createGroup } from '../../controllers/groups/create-group';
import { deleteGroup } from '../../controllers/groups/delete-group';

const router = express.Router();

// Shortened for /api/v1/groups
router.get('/test', currentUser, requireAuth, test);
router.get('/', currentUser, requireAuth, fetchAllGroups);
router.get('/my', currentUser, requireAuth, fetchMyGroups);

router.post(
  '/',
  currentUser,
  requireAuth,
  groupValidation,
  validateRequest,
  createGroup
);

router.delete('/:id', currentUser, requireAuth, deleteGroup);

export { router as groups };
