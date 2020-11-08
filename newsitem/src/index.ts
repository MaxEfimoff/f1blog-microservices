import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from '@f1blog/common';
import { ProfileCreatedListener } from './events/listeners/profile-created-listener';
import { ProfileUpdatedListener } from './events/listeners/profile-updated-listener';
import { ProfileDeletedListener } from './events/listeners/profile-deleted-listener';
import { FetchAllNewsItemsListener } from './events/listeners/fetch-all-newsitems-listener';
import { natsWrapper } from './nats-wrapper';
import { request } from 'express';

require('./services/cache');
// import { createClient } from 'redis';

// DB config
const db = require('./config/keys').mongoURI_newsitem;

// Connect to Mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  if (!process.env.REDIS_HOST) {
    throw new Error('Redis host is not set');
  }

  try {
    await natsWrapper.connect('ticketing', 'cfcf', 'http:nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProfileCreatedListener(natsWrapper.client).listen();
    new ProfileUpdatedListener(natsWrapper.client).listen();
    new ProfileDeletedListener(natsWrapper.client).listen();
    // new FetchAllNewsItemsListener(natsWrapper.client).listen();

    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to DB');

    // const client = await createClient(6379, process.env.REDIS_HOST);

    // client.on('ready', () => {
    //   console.log('Redis is ready.');
    // });

    // const cashedNews = client.get('allNewsItems', (err, data) => {
    //   console.log(data);
    // });

    // if(cashedNews) {
    //   return
    // }
  } catch (err) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('listening on 3000!!!');
  });
};

start();
