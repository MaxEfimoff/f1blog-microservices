import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { natsWrapper } from './nats-wrapper';
import { pool } from './pool';
import { users } from './routes/api/users/users';
import { series } from 'async';
const { execSync } = require('child_process');

// DB config
const db = process.env.MONGO_AUTH_KEY;

// Connect to Mongodb
const start = async () => {
  if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORDnot set');
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

    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MONGO_DB');
  } catch (err) {
    new DatabaseConnectionError;
  }

  try {
    // Postgres Client Setup
    await pool.connect({
      user: process.env.AUTH_PGUSER,
      host: process.env.AUTH_PGHOST,
      database: process.env.AUTH_PGDATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.AUTH_PGPORT
    });

    console.log('Connected to POSTGRES_DB');

    // Run Postgres migrations
    series([
      () => execSync(`
        DATABASE_URL=${process.env.AUTH_PGDATABASE}://${process.env.AUTH_PGUSER}:${process.env.POSTGRES_PASSWORD}@${process.env.AUTH_PGHOST}:${process.env.AUTH_PGPORT}/postgres npm run migrate up
      `)
    ]);

  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('listening on 3000!!!');
  });
};

start();