import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { natsWrapper } from './nats-wrapper';
import { pool } from './pool';
import { series } from 'async';
const { execSync } = require('child_process');

// Connect to Postgres
const start = async () => {
  if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD not set');
  }

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

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
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.AUTH_PGPORT,
    });

    console.log('Connected to POSTGRES_DB');

    // Run Postgres migrations
    series([
      () =>
        execSync(`
        DATABASE_URL=${process.env.AUTH_PGDATABASE}://${process.env.AUTH_PGUSER}:${process.env.POSTGRES_PASSWORD}@${process.env.AUTH_PGHOST}:${process.env.AUTH_PGPORT}/postgres npm run migrate up
      `),
    ]);
  } catch (err) {
    console.log(err);
    new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('listening on 3000!!!');
  });
};

start();
