// import { MongoMemoryServer } from 'mongodb-memory-server';
// import * as mongoose from 'mongoose';

// jest.mock('../src/nats-wrapper');

// export let mongo: any;

// beforeAll(async () => {
//   process.env.JWT_KEY = 'secret';

//   mongo = new MongoMemoryServer();
//   const mongoUri = await mongo.getUri();

//   await mongoose
//     .connect(
//       mongoUri,
//       //   {
//       //   useNewUrlParser: true,
//       //   useUnifiedTopology: true,
//       // }
//     )
//     .then(() => {
//       console.log('Connected to Database');
//     })
//     .catch((err) => {
//       console.log('Not Connected to Database ERROR! ', err);
//     });

//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.drop();
//   }
// });

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

// afterAll(async () => {
//   await mongo.stop().then(() => {
//     console.log('Stopped Database');
//   });
//   await mongoose.connection.close();
// });
