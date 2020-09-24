import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from './errors/database-connecttion-error';

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_Key not set');
  }

  try {
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
