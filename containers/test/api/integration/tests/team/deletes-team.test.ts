import faker from 'faker';
import mongoose from 'mongoose';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/delete-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let res: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let data: any;

  test('Successfully create and delete new team', ({ given, when, then, and }) => {
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

    and('I deleted created team', async () => {
      const { id } = res.data;
      const res2 = await Team.deleteTeam(
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
      expect(res2.status).toBe(200);
    });

    and('I fetch list of all teams', async () => {
      res3 = await Team.fetchAllTeams({
        headers: {
          Authorization: token,
        },
      });

      expect(res3.status).toBe(200);
    });

    then('I validate that new team was deleted and is not present', () => {
      const deleteedTeamId = res.data.id;

      const foundTeams = res3.data;

      const foundTeam = foundTeams.find((team) => team.id === deleteedTeamId);
      expect(foundTeam).toBeUndefined();
    });
  });

  test('Entering invalid credentials for deleting team', ({ given, when, then }) => {
    const userEmail1 = faker.internet.email();

    given('I have created profile for a user', async () => {
      token = (await createRandomProfile(userEmail1)).token;
    });

    when('I send invalid credentials for team deleting', async () => {
      const id = 'fdrfdrfd';
      res = await Team.deleteTeam(
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('I get an error', async () => {
      expect(res.status).toBe(500);
    });
  });

  test('Entering non existing credentials for deleting team', ({ given, when, then }) => {
    given('I have created profile for a user', async () => {
      const userEmail2 = faker.internet.email();

      token = (await createRandomProfile(userEmail2)).token;
    });

    when('I send non existing credentials for team deleting', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      res = await Team.deleteTeam(
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('I get an error', async () => {
      expect(res.status).toBe(404);
    });
  });
});
