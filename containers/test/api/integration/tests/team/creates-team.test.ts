import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';
import faker from 'faker';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { AxiosResponse } from 'axios';

const feature = loadFeature('../../features/team/create-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let res: AxiosResponse<any>;
  let data: any;

  test('Entering valid credentials for new team', ({ given, when, then }) => {
    given('I have created profile for a user', async () => {
      const userEmail = faker.internet.email();
      token = (await createRandomProfile(userEmail)).token;
    });

    when('I send valid credentials for a new team', async () => {
      data = {
        title: faker.company.companyName(),
      };

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });
    });

    then('New team should be created', () => {
      expect(res.status).toBe(201);
      expect(res.data.title).toEqual(data.title);
    });
  });

  test('Entering invalid credentials for new team', ({ given, when, then }) => {
    let token: any;
    let res: AxiosResponse<any>;
    let data: any;

    given('I have created profile for a user', async () => {
      const userEmail = faker.internet.email();
      token = (await createRandomProfile(userEmail)).token;
    });

    when('I send invalid credentials for a new team', async () => {
      data = { title: 4664564 };

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });
    });

    then('New team should not be created', () => {
      expect(res.status).toBe(400);
      expect(res.data.message[0]).toEqual('title must be a string');
      expect(res.data.title).toBeUndefined();
    });
  });

  test('Entering empty credentials for new team', ({ given, when, then }) => {
    let token: any;
    let res: AxiosResponse<any>;
    let data: any;

    given('I have created profile for a user', async () => {
      const userEmail = faker.internet.email();
      token = (await createRandomProfile(userEmail)).token;
    });

    when('I send empty credentials for a new team', async () => {
      data = {};

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });
    });

    then('New team should not be created', () => {
      expect(res.status).toBe(400);
      expect(res.data.message[0]).toEqual('title must be a string');
      expect(res.data.title).toBeUndefined();
    });
  });
});
