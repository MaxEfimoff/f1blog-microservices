import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';
import { createTeam } from './helpers/create-team';
import { Team } from '../../db/models/Team';
import { createProfile } from './helpers/create-profile';

const userId = 1;
const secondUserId = 2;
const teamTitle = 'faketitle';
const groupTitle = 'fakegrouptitle';
const secondGroupTitle = 'fakegrouptgtr4';

it('returns 200 after fetching all groups in team', async () => {
  await createProfile(secondUserId, 'fre', 'grgr');
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

  // Create second group by different user
  const token2 = await login(secondUserId);

  const res4 = await request(app)
    .post(`/api/v1/groups/team/${teamId}`)
    .set('Authorization', token2)
    .send({ title: secondGroupTitle })
    .expect(201);

  const secondGroup = res4.body.data.newGroup;

  expect(secondGroup.title).toEqual(secondGroupTitle);
  expect(secondGroup.team.title).toEqual(teamTitle);

  // Fetch my groups in the team
  const res5 = await request(app)
    .get(`/api/v1/groups/my/team/${teamId}`)
    .set('Authorization', token)
    .expect(200);

  expect(res5.body.data.groups[0]).toBeDefined;
  expect(res5.body.data.groups[1]).toBeNull;
  expect(res5.body.data.groups[0].title).toEqual(groupTitle);

  const res6 = await request(app)
    .get(`/api/v1/groups/my/team/${teamId}`)
    .set('Authorization', token2)
    .expect(200);

  expect(res6.body.data.groups[0]).toBeDefined;
  expect(res6.body.data.groups[1]).toBeNull;
  expect(res6.body.data.groups[0].title).toEqual(secondGroupTitle);
});
