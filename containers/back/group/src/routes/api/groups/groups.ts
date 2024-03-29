import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { groupValidation } from '../../../validation/create-group';

import { test } from '../../controllers/groups/test';
import { fetchAllGroupsInTeam } from '../../controllers/groups/fetch-all-groups-in-team';
import { fetchMyGroups } from '../../controllers/groups/fetch-my-groups-in-team';
import { fetchAllProfiles } from '../../controllers/groups/fetch-all-profiles';
import { createGroupInTeam } from '../../controllers/groups/create-group-in-team';
import { deleteGroupInTeam } from '../../controllers/groups/delete-group-in-team';
import { joinGroup } from '../../controllers/groups/join-group';
import { leaveGroup } from '../../controllers/groups/leave-group';
import { fetchGroupInTeam } from '../../controllers/groups/fetches-group-in-team';
import { fetchAllTeams } from '../../controllers/groups/fetch-all-teams';

const router = express.Router();

// Shortened for /api/v1/groups
router.get('/test', currentUser, requireAuth, test);
router.get('/teams/:id', currentUser, requireAuth, fetchAllGroupsInTeam);
router.get('/team/:id/group/:groupId', currentUser, requireAuth, fetchGroupInTeam);
router.get('/my/team/:id', currentUser, requireAuth, fetchMyGroups);
router.get('/profiles', currentUser, requireAuth, fetchAllProfiles);
router.get('/all-teams', currentUser, requireAuth, fetchAllTeams);

router.post(
  '/team/:id',
  currentUser,
  requireAuth,
  groupValidation,
  validateRequest,
  createGroupInTeam,
);
router.post('/join-team/:id/group/:groupId', currentUser, requireAuth, joinGroup);
router.post('/leave-team/:id/group/:groupId', currentUser, requireAuth, leaveGroup);

router.delete('/team/:id/group/:groupId', currentUser, requireAuth, deleteGroupInTeam);

export { router as groups };
