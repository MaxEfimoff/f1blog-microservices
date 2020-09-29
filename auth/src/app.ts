import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@f1blog/common';
import passport from 'passport';

// Routes
import { users } from './routes/api/users/users';

const app = express();

app.use(json());

// Use routes
app.use('/api/v1/users', users);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.use(passport.initialize());
require('./config/passport')(passport);

export { app };
