import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { natsWrapper } from './nats-wrapper';
import { pool } from './pool';

// DB config
const db = process.env.MONGO_AUTH_KEY;
// const db = require('./config/keys').mongoURI;

// Connect to Mongodb
const start = async () => {
  if (!process.env.AUTH_PG_PASSWORD) {
    throw new Error('AUTH_PG_PASSWORD not set');
  }

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  if (!process.env.MONGO_AUTH_KEY) {
    throw new Error('MONGO_AUTH_KEY not set');
  }

  try {
    await natsWrapper.connect('ticketing', 'bjhvhv', 'http:nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Postgres Client Setup
    await pool.connect({
      user: process.env.AUTH_PGUSER,
      host: process.env.AUTH_PGHOST,
      database: process.env.AUTH_PGDATABASE,
      password: process.env.AUTH_PG_PASSWORD,
      port: process.env.AUTH_PGPORT
    });

    console.log('Connected to POSTGRES_DB');

    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MONGO_DB');
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('listening on 3000!!!');
  });
};

start();
