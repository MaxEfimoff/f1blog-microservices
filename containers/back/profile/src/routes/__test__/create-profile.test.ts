import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { login } from './helpers/login';

it('returns 401 if user is not logged in', async () => {
  return request(app).get('/api/v1/profiles/all').expect(401);
});
