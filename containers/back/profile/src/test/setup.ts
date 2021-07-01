import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

let mongo: any;
let profileId: string;
let userId: string;

beforeAll(async () => {
  process.env.JWT_KEY = "secret";

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
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  // const db = await mongoose.connection.db;

  // await db.dropCollection("profiles");

  // const profilesColl = await db.createCollection("profiles");

  // await profilesColl.insertOne(
  //   {
  //     active: true,
  //     karma: 1000,
  //     name: "Max",
  //     handle: "max4",
  //   },
  //   (err, res) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       profileId = res.ops[0]._id;
  //       console.log("Created profile: ", profileId);
  //     }
  //   }
  // );
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
