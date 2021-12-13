import faker from 'faker';
import mongoose from 'mongoose';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/join-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let token2: any;
  let res: AxiosResponse<any>;
  let res2: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let data: any;
  let profileId: string;
  let userEmail = faker.internet.email();

  test('Successfully create and join new team', ({ given, when, then, and }) => {
    given('I have created 2 profiles for different users', async () => {
      let userEmail1 = faker.internet.email();

      //token = (await createRandomProfile()).token;
      const profile = await createRandomProfile(userEmail);
      token = profile.token;
      profileId = profile.profileId;
      token2 = (await createRandomProfile(userEmail1)).token;
    });

    when('As a first user I create new team', async () => {
      const data = {
        title: faker.company.companyName(),
      };

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token2,
        },
      });

      expect(res.status).toBe(201);
    });

    and('As a second user I join created team', async () => {
      const { id } = res.data;

      res2 = await Team.joinTeam(
        {},
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then("I validate that 2nd user's id exists in the list of joined users", () => {
      expect(res2.status).toBe(201);
      expect(res2.data.members[0]).toEqual(profileId);
    });
  });

  test('Try to join unexisting team', ({ given, when, then, and }) => {
    given('I have created profile for a user', async () => {
      const userEmail = faker.internet.email();
      const profile = await createRandomProfile(userEmail);

      token = profile.token;
      profileId = profile.profileId;
    });

    when('I try to join unexisting team', async () => {
      const id = new mongoose.Types.ObjectId().toString();

      res2 = await Team.joinTeam(
        {},
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('I get an error', () => {
      expect(res2.status).toBe(404);
      expect(res2.data.message).toEqual('You should create team first');
    });
  });

  test('Try to join a team twice', ({ given, when, then, and }) => {
    given('I have created 2 profiles for different users', async () => {
      const userEmail1 = faker.internet.email();
      const userEmail2 = faker.internet.email();

      //token = (await createRandomProfile()).token;
      const profile = await createRandomProfile(userEmail1);
      token = profile.token;
      profileId = profile.profileId;
      token2 = (await createRandomProfile(userEmail2)).token;
    });

    when('As a first user I create new team', async () => {
      const data = {
        title: faker.company.companyName(),
      };

      res = await Team.createTeam(data, {
        headers: {
          Authorization: token2,
        },
      });

      expect(res.status).toBe(201);
    });

    and('As a second user I join created team', async () => {
      const { id } = res.data;

      res2 = await Team.joinTeam(
        {},
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );

      expect(res2.status).toBe(201);
      expect(res2.data.members[0]).toEqual(profileId);
    });

    and('As a second user I try to join that team once more', async () => {
      const { id } = res.data;

      res3 = await Team.joinTeam(
        {},
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then('I get an error', () => {
      expect(res3.status).toBe(400);
      expect(res3.data.message).toEqual('You are already a member of this team');
    });
  });
});
