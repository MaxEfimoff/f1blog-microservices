import express from 'express';
import { validateRequest, currentUser, requireAuth } from '@f1blog/common';
import { teamValidation } from '../../../validation/create-team';
import { test } from '../../controllers/teams/test-check';
import { fetchAllTeams } from '../../controllers/teams/fetch-all-teams';
import { fetchMyTeams } from '../../controllers/teams/fetch-my-teams';
import { createTeam } from '../../controllers/teams/create-team';
import { updateTeam } from '../../controllers/teams/update-team';
import { deleteTeam } from '../../controllers/teams/delete-team';
import { joinTeam } from '../../controllers/teams/join-team';
import { leaveTeam } from '../../controllers/teams/leave-team';
import { fetchTeamById } from '../../controllers/teams/fetch-team-by-id';
import { fetchAllProfiles } from '../../controllers/teams/fetch-all-profiles';
import { fetchTeamByTitle } from '../../controllers/teams/fetch-team-by-title';
import { fetchAllUsersInTeam } from '../../controllers/teams/fetch-all-users-in-team';
import { deleteUserFromTeam } from '../../controllers/teams/delete-user-from-team';

const router = express.Router();

// Shortened for /api/v1/teams
router.get('/test', currentUser, requireAuth, test);
router.get('/all', currentUser, requireAuth, fetchAllTeams);
router.get('/my', currentUser, requireAuth, fetchMyTeams);
router.get('/profiles', currentUser, requireAuth, fetchAllProfiles);
router.get('/:id', currentUser, requireAuth, fetchTeamById);
router.get('/title/:title', currentUser, requireAuth, fetchTeamByTitle);
router.get('/:id/all', currentUser, requireAuth, fetchAllUsersInTeam);

router.post('/', currentUser, requireAuth, teamValidation, validateRequest, createTeam);
router.post('/:id/join', currentUser, requireAuth, validateRequest, joinTeam);
router.post('/:id/leave', currentUser, requireAuth, validateRequest, leaveTeam);

router.patch('/:id', currentUser, requireAuth, teamValidation, validateRequest, updateTeam);

router.delete('/:id/user/:deleteuserid', currentUser, requireAuth, deleteUserFromTeam);
router.delete('/:id', currentUser, requireAuth, deleteTeam);

export { router as teams };
