import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';
import { createProfile } from './helpers/create-profile';
import { Profile } from '../../db/models/profile.schema';
import { generatedId } from './helpers/generate-id';
import { natsWrapper } from '../../nats-wrapper';

const userId = 3;
const name = 'fakename';
const handle = 'fakehandle';

beforeAll((done) => {
  createProfile(userId, name, handle);

  done();
});

it('returns 201 on deleting profile', async () => {
  const token = await login(userId);

  const res = await request(app)
    .get('/api/v1/profiles/current')
    .set('Authorization', token)
    .expect(200);

  expect(res.body.data.profile.handle).toEqual(handle);

  await request(app).delete('/api/v1/profiles/').set('Authorization', token).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const res3 = await request(app)
    .get('/api/v1/profiles/all')
    .set('Authorization', token)
    .expect(200);

  expect(res3.body.data.profiles[0]).toBeNull;

  let profiles = await Profile.find({});
  expect(profiles.length).toEqual(0);
});

it('returns 401 on deleting profile if user is not authenticated', async () => {
  await request(app).delete('/api/v1/profiles/').expect(401);
});

it('returns 404 on deleting profile if id is incorrect', async () => {
  const token = await login(userId);

  await request(app)
    .delete(`/api/v1/profiles/${generatedId}`)
    .set('Authorization', token)
    .expect(404);
});
