import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';
import faker from 'faker';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('../../features/team/leave-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let token2: any;
  let res: AxiosResponse<any>;
  let res2: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let data: any;
  let profileId: string;

  test('Successfully create, join and leave team', ({ given, when, then, and }) => {
    given('I have created 2 profiles for different users', async () => {
      const userEmail = faker.internet.email();
      const userEmail1 = faker.internet.email();

      const profile = await createRandomProfile(userEmail);
      token = profile.token;
      profileId = profile.profileId;
      token2 = (await createRandomProfile(userEmail1)).token;
    });

    when('As a first user I have created new team', async () => {
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

    and('As a second user I have joined created team', async () => {
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

    and("I validated that second user's id exists in the list of joined users", () => {
      expect(res2.status).toBe(201);
      expect(res2.data.members[0]).toEqual(profileId);
      expect(res2.data.members.length).toEqual(2);
    });

    and('As a second user I have left the team', async () => {
      const { id } = res.data;

      res3 = await Team.leaveTeam(
        {},
        {
          headers: {
            Authorization: token,
          },
        },
        id,
      );
    });

    then("I validated that second user's id does not exist in the list of joined users", () => {
      expect(res3.status).toBe(201);
      expect(res3.data.members.length).toEqual(1);
      expect(res3.data.members[1]).toBeUndefined();
    });
  });

  test('Try to leave team not being a member of it', ({ given, when, then, and }) => {
    given('I have created 2 profiles for different users', async () => {
      const userEmail = faker.internet.email();
      const userEmail1 = faker.internet.email();

      const profile = await createRandomProfile(userEmail);
      token = profile.token;
      profileId = profile.profileId;
      token2 = (await createRandomProfile(userEmail1)).token;
    });

    when('As a first user I have created new team', async () => {
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

    and('As a second user I try to leave the team not being a member of it', async () => {
      const { id } = res.data;

      res3 = await Team.leaveTeam(
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
      expect(res3.status).toBe(404);
      expect(res3.data.message).toEqual('You are not a member of this team');
    });
  });
});
