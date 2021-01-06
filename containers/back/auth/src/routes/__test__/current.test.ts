import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';

it('returns 200 if user is logged in', async () => {
  const token = await login();

  const response = await request(app)
    .get('/api/v1/users/current')
    .set('Authorization', token)
    .send()
    .expect(200);

  expect(response.body.data.name).toEqual('Max');
});

it('returns 200 if user is logged in', async () => {
  return request(app).get('/api/v1/users/current').expect(401);
});
