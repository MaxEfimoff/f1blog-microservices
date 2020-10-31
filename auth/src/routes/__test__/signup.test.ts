import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

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

it('returns 201 on successful signup', async () => {
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      name: 'bfgbfg',
      email: 'test@test.com',
      password: 'password',
      password2: 'password',
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
