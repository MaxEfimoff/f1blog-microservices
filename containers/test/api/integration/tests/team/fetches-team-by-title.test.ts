import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';
import faker from 'faker';
import mongoose from 'mongoose';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('../../features/team/fetch-team-by-title.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let token2: any;
  let res: AxiosResponse<any>;
  let res2: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let data: any;
  let profileId: string;

  test('Successfully fetching existing team by title', ({ given, when, then, and }) => {
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

      expect(res.status).toBe(201);
    });

    then('I successfully fetch created team by title', async () => {
      const { title } = res.data;
      const res2 = await Team.fetchTeamByTitle(
        {
          headers: {
            Authorization: token,
          },
        },
        title,
      );
      expect(res2.status).toBe(200);
    });
  });

  test('Unsuccessfully trying to fetch team by wrong title', ({ given, when, then, and }) => {
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

      expect(res.status).toBe(201);
    });

    and('I try to fetch created team by wrong title', async () => {
      const title = 'wrongTitle';
      res2 = await Team.fetchTeamByTitle(
        {
          headers: {
            Authorization: token,
          },
        },
        title,
      );
    });

    then('I get an error message', () => {
      expect(res2.status).toBe(404);
      expect(res2.statusText).toBe('Not Found');
    });
  });
});
