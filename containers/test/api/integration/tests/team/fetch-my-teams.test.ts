import faker from 'faker';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/fetch-my-teams.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let res: AxiosResponse<any>;

  test('Successfully fetch my teams', ({ given, when, then, and }) => {
    given('I have created profile', async () => {
      const userEmail = faker.internet.email();

      token = (await createRandomProfile(userEmail)).token;
    });

    when(
      'I have fetched my teams and have validated that there are no teams created by me',
      async () => {
        const res2 = await Team.fetchMyTeams({
          headers: {
            Authorization: token,
          },
        });

        expect(res2.status).toBe(200);
        expect(res2.data.length).toEqual(0);
      },
    );

    and('I have created new team', async () => {
      const data = {
        title: faker.company.companyName(),
      };

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });

      expect(res.status).toBe(201);
      expect(res.data.title).toEqual(data.title);

      const res3 = await Team.fetchMyTeams({
        headers: {
          Authorization: token,
        },
      });

      expect(res3.status).toBe(200);
    });

    and(
      'I have fetched my teams and have validated that there is 1 team created by me',
      async () => {
        const res3 = await Team.fetchMyTeams({
          headers: {
            Authorization: token,
          },
        });

        expect(res3.status).toBe(200);
        expect(res3.data.length).toEqual(1);
      },
    );

    and('I have created another team', async () => {
      const data = {
        title: faker.company.companyName(),
      };

      const res4 = await Team.createTeam(data, {
        headers: {
          Authorization: token,
        },
      });

      expect(res4.status).toBe(201);
      expect(res4.data.title).toEqual(data.title);

      const res5 = await Team.fetchMyTeams({
        headers: {
          Authorization: token,
        },
      });

      expect(res5.status).toBe(200);
    });

    and(
      'I have fetched my teams and have validated that there are 2 teams created by me',
      async () => {
        const res5 = await Team.fetchMyTeams({
          headers: {
            Authorization: token,
          },
        });

        expect(res5.status).toBe(200);
        expect(res5.data.length).toEqual(2);
      },
    );

    and('I have deleted first team', async () => {
      const { id } = res.data;

      const res6 = await Team.deleteTeam(
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );

      expect(res6.status).toBe(200);
    });

    then(
      'I have fetched my teams and have validated that there is 2 teams left created by me',
      async () => {
        const res7 = await Team.fetchMyTeams({
          headers: {
            Authorization: token,
          },
        });

        expect(res7.data.length).toEqual(2);
        expect(res7.status).toBe(200);
      },
    );
  });
});
