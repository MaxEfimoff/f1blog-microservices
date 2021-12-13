import faker from 'faker';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/fetch-all-teams.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let res3: AxiosResponse<any>;
  let data: { title: string };
  let data1: { title: string };
  const userEmail = faker.internet.email();

  test('Successfully fetching all teams', ({ given, when, then, and }) => {
    given('I have created profile for a user', async () => {
      token = (await createRandomProfile(userEmail)).token;
    });

    when('I have created 2 teams', async () => {
      data = {
        title: faker.company.companyName(),
      };

      data1 = {
        title: faker.company.companyName(),
      };

      const res = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });

      const res2 = await Team.createTeam(data1, {
        headers: {
          Authorization: token,
        },
      });

      expect(res.status).toBe(201);
      expect(res.data.title).toEqual(data.title);
      expect(res2.status).toBe(201);
      expect(res2.data.title).toEqual(data1.title);
    });

    and('I fetch all teams', async () => {
      res3 = await Team.fetchAllTeams({
        headers: {
          Authorization: token,
        },
      });
    });

    then('Both teams should be present', () => {
      expect(res3.status).toBe(200);
      expect(res3.data[res3.data.length - 1].title).toEqual(data1.title);
      expect(res3.data[res3.data.length - 2].title).toEqual(data.title);
    });
  });
});
