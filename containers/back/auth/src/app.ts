import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@f1blog/common';

// import passport from 'passport';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Routes
import { users } from './routes/api/users/users';

const app = express();

app.use(json());

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
