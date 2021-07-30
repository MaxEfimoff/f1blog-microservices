import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { groupValidation } from '../../../validation/create-group';

import { test } from '../../controllers/groups/test';
import { fetchAllGroupsInTeam } from '../../controllers/groups/fetch-all-groups-in-team';
import { fetchMyGroups } from '../../controllers/groups/fetch-my-groups-in-team';
import { fetchAllProfiles } from '../../controllers/groups/fetch-all-profiles';
import { createGroupInTeam } from '../../controllers/groups/create-group-in-team';
import { deleteGroupInTeam } from '../../controllers/groups/delete-group-in-team';

const router = express.Router();

// Shortened for /api/v1/groups
router.get('/test', currentUser, requireAuth, test);
router.get('/team/:id', currentUser, requireAuth, fetchAllGroupsInTeam);
router.get('/my/team/:id', currentUser, requireAuth, fetchMyGroups);
router.get('/profiles', currentUser, requireAuth, fetchAllProfiles);

router.post(
  '/team/:id',
  currentUser,
  requireAuth,
  groupValidation,
  validateRequest,
  createGroupInTeam,
);

router.delete('/:groupId/team/:teamId', currentUser, requireAuth, deleteGroupInTeam);

export { router as groups };
