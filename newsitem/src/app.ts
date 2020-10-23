import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@f1blog/common';

// Routes
import { newsitems } from './routes/api/newsitems/newsitems';

const app = express();

app.use(json());

// Use routes
app.use('/api/v1/newsitems', newsitems);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
