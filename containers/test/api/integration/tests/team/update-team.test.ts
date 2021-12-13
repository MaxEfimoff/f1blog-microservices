import faker from 'faker';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/update-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let res: AxiosResponse<any>;
  let res2: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let data: any;
  let updatedData: any;

  test('Entering valid credentials and update new team', ({ given, when, then, and }) => {
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
      expect(res.data.title).toEqual(data.title);
    });

    and('I send valid payload to update created team', async () => {
      const { id } = res.data;

      updatedData = {
        title: 'updatedTitle',
      };

      res2 = await Team.updateTeam(
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('Team is successfully updated', () => {
      expect(res2.status).toBe(201);
      expect(res2.data.title).toEqual(updatedData.title);
    });
  });

  test('Entering invalid credentials and update new team', ({ given, when, then, and }) => {
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
      expect(res.data.title).toEqual(data.title);
    });

    and('I send invalid payload to update created team', async () => {
      const { id } = res.data;

      updatedData = {
        cfgfcg: 67868,
      };

      res3 = await Team.updateTeam(
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('Get an error', () => {
      console.log(res3.data);
      expect(res3.status).toBe(400);
      expect(res3.data.message[0]).toEqual('title must be a string');
    });
  });
});
