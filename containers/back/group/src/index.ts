import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { ProfileCreatedListener } from './events/listeners/profile-created-listener';
import { ProfileUpdatedListener } from './events/listeners/profile-updated-listener';
import { ProfileDeletedListener } from './events/listeners/profile-deleted-listener';
import { TeamCreatedListener } from './events/listeners/team-created-listener';
import { TeamUpdatedListener } from './events/listeners/team-updated-listener';
import { TeamDeletedListener } from './events/listeners/team-deleted-listener';
import { natsWrapper } from './nats-wrapper';

// Connect to Mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
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
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProfileCreatedListener(natsWrapper.client).listen();
    new ProfileUpdatedListener(natsWrapper.client).listen();
    new ProfileDeletedListener(natsWrapper.client).listen();

    new TeamCreatedListener(natsWrapper.client).listen();
    new TeamUpdatedListener(natsWrapper.client).listen();
    new TeamDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to DB');
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('listening on 3000!!!');
  });
};

start();
