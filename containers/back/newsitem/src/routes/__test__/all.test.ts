import request from 'supertest';
import { app } from '../../app';
import { login } from './helpers/login';

it('returns 200 if user is logged in', async () => {
  const token = await login();

  await request(app)
    .get('/api/v1/newsitems/')
    .set('Authorization', token)
    .send()
    .expect(200);
});
