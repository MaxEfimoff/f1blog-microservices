import request from 'supertest';
import { app } from '../../../app';

export const login = async () => {
  const email = 'emv3@ya.ru';
  const password = '123456';

  const authResponse = await request(app).post('/api/v1/users/login').send({
    email: 'emv3@ya.ru',
    password: '123456',
  });

  const authToken = authResponse.body.data.token;
  return authToken;
};
