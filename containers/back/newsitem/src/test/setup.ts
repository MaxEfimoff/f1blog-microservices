import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
let profileId: string;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'secret';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
    await collection.drop();
  }

  const db = await mongoose.connection.db;

  const profilesColl = await db.createCollection('profiles');

  await profilesColl.insertOne(
    {
      user_id: '5f92bdf7588d530018595a09',
      handle: 'Max4',
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        profileId = res.ops[0]._id;
        console.log('Created profile: ', profileId);
      }
    }
  );
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
