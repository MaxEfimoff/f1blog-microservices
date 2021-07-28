import express from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@f1blog/common';
import swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from './swagger/openapi.json';

// import passport from 'passport';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Routes
import { users } from './routes/api/users/users';

const app = express();

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

// Set security http headers
app.use(helmet());

// Swagger
app.use(
  '/api/v1/users/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

// Data sanitazion
app.use(xss());

// Limits number of requests from the same IP
app.use('/api/v1/users', limiter);

// Body parser, reading data from the body into req.body
app.use(json({ limit: '10kb' }));

// const keys = require('./config/keys_dev.js');
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: '/api/v1/users/googleoauth/callback',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log('access token', accessToken);
//       console.log('refresh token', refreshToken);
//       console.log('profile: ', profile);
//     }
//   )
// );

// Use routes
app.use('/api/v1/users', users);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
