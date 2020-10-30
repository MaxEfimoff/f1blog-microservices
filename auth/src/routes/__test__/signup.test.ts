import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/v1/users/signup')
    .send({
      name: 'bfgbfg',
      email: 'test@test.com',
      password: 'password',
      password2: 'password',
    })
    .expect(201);
});
