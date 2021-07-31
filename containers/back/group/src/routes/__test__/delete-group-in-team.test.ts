import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';
import { createTeam } from './helpers/create-team';
import { Team } from '../../db/models/Team';

const userId = 1;
const teamTitle = 'faketitle';
const groupTitle = 'fakegrouptitle';

it('returns 200 after fetching all groups in team', async () => {
  await createTeam(userId, teamTitle);

  const token = await login(userId);

  // Fetch created team
  const res = await Team.find();

  expect(res[0]).toBeDefined;
  expect(res[0].title).toEqual(teamTitle);

  const teamId = res[0]._id;

  const res2 = await request(app)
    .get(`/api/v1/groups/team/${teamId}`)
    .set('Authorization', token)
    .expect(200);

  expect(res2.body.data.groups).toBeNull;

  // Create first group in a team
  const res3 = await request(app)
    .post(`/api/v1/groups/team/${teamId}`)
    .set('Authorization', token)
    .send({ title: groupTitle })
    .expect(201);

  const group = res3.body.data.newGroup;

  expect(group.title).toEqual(groupTitle);
  expect(group.team.title).toEqual(teamTitle);

  // Delete first group in a team
  await request(app)
    .delete(`/api/v1/groups/${group.id}/team/${teamId}`)
    .set('Authorization', token)
    .expect(201);

  const res4 = await request(app)
    .get(`/api/v1/groups/team/${teamId}`)
    .set('Authorization', token)
    .expect(200);

  expect(res4.body.data.groups).toBeNull;
});
