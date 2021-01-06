import request from 'supertest';
import { app } from '../../app';

it('returns 400 if no email was sent', async () => {
  return request(app).post('/api/v1/users/reset-password').send({}).expect(400);
});

it('returns 400 if email was incorrect', async () => {
  return request(app)
    .post('/api/v1/users/reset-password')
    .send({
      email: 'cece@rfefe.rr',
    })
    .expect(400);
});

it('returns 201 if email was correct', async () => {
  return request(app)
    .post('/api/v1/users/reset-password')
    .send({
      email: 'emv3@ya.ru',
    })
    .expect(201);
});
