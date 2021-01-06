import request from 'supertest';
import { app } from '../../app';

it('returns 200 on valid login/password', async () => {
  return request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'emv3@ya.ru',
      password: '123456',
    })
    .expect(200);
});

it('returns 400 on valid email and invalid password', async () => {
  return request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'emv3@ya.ru',
      password: '1234fgbf56',
    })
    .expect(400);
});

it('returns 400 on invalid email and valid password', async () => {
  return request(app)
    .post('/api/v1/users/login')
    .send({
      email: 'emvvbfrgb@ya.ru',
      password: '123456',
    })
    .expect(400);
});

it('returns 400 on non-existing login/password', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'emv3@ya.ru' })
    .expect(400);
  await request(app)
    .post('/api/v1/users/login')
    .send({ password: '123456' })
    .expect(400);
  await request(app).post('/api/v1/users/login').send({}).expect(400);
});

it('returns 404 for not authenticated user', async () => {
  return request(app).post('/api/v1/users/current').expect(404);
});
