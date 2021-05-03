import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { teamValidation } from '../../../validation/create-team';

import { test } from '../../controllers/teams/test';
import { fetchAllTeams } from '../../controllers/teams/fetch-all-teams';
import { fetchMyTeams } from '../../controllers/teams/fetch-my-teams';
import { createTeam } from '../../controllers/teams/create-team';
import { updateTeam } from '../../controllers/teams/update-team';
import { deleteTeam } from '../../controllers/teams/delete-team';

const router = express.Router();

// Shortened for /api/v1/groups
router.get('/test', currentUser, requireAuth, test);
router.get('/', currentUser, requireAuth, fetchAllTeams);
router.get('/my', currentUser, requireAuth, fetchMyTeams);

router.post(
  '/',
  currentUser,
  requireAuth,
  teamValidation,
  validateRequest,
  createTeam
);

router.delete('/:id', currentUser, requireAuth, deleteTeam);

export { router as teams };
