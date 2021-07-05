import { app } from "../app";
import { users } from "../routes/api/users/users";
import { newDb } from "pg-mem";

// jest.mock('../nats-wrapper');
let db: any;
let backup: any;

beforeAll(async () => {
  console.log("Before test");

  db = newDb();

  await db.public.many(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,  
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(500) NOT NULL,
      active BOOLEAN DEFAULT FALSE,
      role VARCHAR(50),
      version INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.public.many(`
    INSERT INTO users (name, password, email, active)
    VALUES ('max', '123456', 'emv3@ya.ru', true);
  `);

  backup = db.backup();
});

beforeEach(async () => {
  backup.restore();
});
