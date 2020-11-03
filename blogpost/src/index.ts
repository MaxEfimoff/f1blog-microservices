import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { ProfileCreatedListener } from './events/listeners/profile-created-listener';
import { GroupCreatedListener } from './events/listeners/group-created-listener';
import { BlogPostCreatedListener } from './events/listeners/group-blogpost-created-listener';
import { natsWrapper } from './nats-wrapper';

// DB config
const db = require('./config/keys').mongoURI_blogpost;

// Connect to Mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  try {
    await natsWrapper.connect(
      'ticketing',
      'bfghfjhrejre',
      'http:nats-srv:4222'
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProfileCreatedListener(natsWrapper.client).listen();
    new GroupCreatedListener(natsWrapper.client).listen();
    new BlogPostCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(db, {
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
