import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { login } from '../helpers/login';
import { createProfile } from '../helpers/create-profile';
import { Team } from '../../src/team/schemas/team.schema';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const userId = 1;
const userName = 'testusername';
const profileHandle = 'testprofilehandle';
const title = 'faketitle';

jest.setTimeout(30000);

beforeAll(() => {
  process.env.JWT_KEY = 'secret';
});

let app: INestApplication;
let mongod: MongoMemoryServer;

describe('Create team', () => {
  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    //const uri = await mongod.getUri();
    const uri =
      'mongodb+srv://wildblood:erager164572@cluster0.izeq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        // MongooseModule.forRootAsync({
        //   useFactory: async () => {
        //     console.log('MONGOD', mongod);
        //     console.log('uri', uri);
        //     return {
        //       uri: uri,
        //     };
        //   },
        // }),
        AppModule,
      ],
    }).compile();
    console.log('URI', uri);
    app = moduleFixture.createNestApplication();
    await app.init();

    await createProfile(userId, userName, profileHandle);
  });

  it('returns 200 after creating a team', async () => {
    const token = await login(userId);
    console.log(token);

    const teamsNumber = await Team.find();
    console.log(teamsNumber);

    expect(teamsNumber[0]).toBeUndefined();

    const res = await request(app)
      .post('/api/v1/teams/')
      .set('Authorization', token)
      .send({ title: title })
      .expect(201);

    console.log(res);
    const teams = await Team.find();
    console.log(teams);

    expect(teams[0].title).toEqual(title);
    expect(res.body.data.newTeam.title).toEqual(title);
    expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);
  });

  it('returns 401 after creating a team while unauthorized', async () => {
    const token = await login(userId);

    const teamsNumber = await Team.find();

    expect(teamsNumber[0]).toBeUndefined();

    await request(app)
      .post('/api/v1/teams/')
      .send({ title: title })
      .expect(401);
  });

  it('returns 400 after creating a team without a title', async () => {
    const token = await login(userId);

    const teamsNumber = await Team.find();

    expect(teamsNumber[0]).toBeUndefined();

    await request(app)
      .post('/api/v1/teams/')
      .set('Authorization', token)
      .send({ title: '' })
      .expect(400);
  });
});

// afterAll(async () => {
//   await mongod.stop().then(() => {
//     console.log('Stopped Database');
//   });
// });
