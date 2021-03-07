// import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import { app } from '../app';
// import { users } from '../routes/api/users/users';

// let mongo: any;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  // process.env.JWT_KEY = 'yjdtjd';

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  if (!process.env.MONGO_AUTH_KEY) {
    throw new Error('MONGO_AUTH_KEY not set');
  }

  const db = process.env.MONGO_AUTH_KEY;

  await mongoose.connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  // mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();

  // await mongoose.connect(mongoUri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
});

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }

//   const db = await mongoose.connection.db;

//   await db.dropCollection('users');
//   const usersColl = await db.createCollection('users');

//   await usersColl.insertOne({
//     active: true,
//     role: 'guest',
//     name: 'Max',
//     email: 'emv3@ya.ru',
//     password: '$2b$10$8zemadXxMLUwpf38PyZGDOMeeYr2d1qv5hEduzRx4Ex12xyYIUzmy',
//   });
// });

// afterAll(async () => {
//   await mongo.stop();
//   await mongoose.connection.close();
// });
