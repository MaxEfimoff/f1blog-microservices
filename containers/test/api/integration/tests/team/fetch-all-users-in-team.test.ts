import faker from 'faker';
import { AxiosResponse } from 'axios';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';

const feature = loadFeature('../../features/team/fetch-all-users-in-team.feature');

beforeAll(() => jest.setTimeout(150 * 1000));

defineFeature(feature, (test) => {
  let token: any;
  let token2: any;
  let token3: any;
  let res: AxiosResponse<any>;
  let res2: AxiosResponse<any>;
  let res3: AxiosResponse<any>;
  let profileId: string;

  test('Successfully fetch all users in team', ({ given, when, then, and }) => {
    given('I have created 3 profiles for different users', async () => {
      const userEmail = faker.internet.email();
      const userEmail1 = faker.internet.email();
      const userEmail2 = faker.internet.email();

      const profile = await createRandomProfile(userEmail);
      token = profile.token;
      profileId = profile.profileId;
      token2 = (await createRandomProfile(userEmail1)).token;
      token3 = (await createRandomProfile(userEmail2)).token;
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

      expect(res2.status).toBe(201);
      expect(res2.data.members[0]).toEqual(profileId);
      expect(res2.data.members.length).toEqual(2);
    });

    and('I fetched all users from the team and validate both users are there', async () => {
      const { id } = res.data;

      const res2 = await Team.fetchAllUsersInTeam(
        {
          headers: {
            Authorization: token2,
          },
        },
        id,
      );

      expect(res2.status).toBe(200);
      expect(res2.data.length).toEqual(2);
    });

    and('As a third user I have joined the team', async () => {
      const { id } = res.data;

      res3 = await Team.joinTeam(
        {},
        {
          headers: {
            Authorization: token3,
          },
        },
        id,
      );

      expect(res3.status).toBe(201);
      expect(res3.data.members.length).toEqual(3);
    });

    and('I fetched all users from the team and validate all three users are there', async () => {
      const { id } = res.data;

      const res2 = await Team.fetchAllUsersInTeam(
        {
          headers: {
            Authorization: token2,
          },
        },
        id,
      );

      expect(res2.status).toBe(200);
      expect(res2.data.length).toEqual(3);
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

    then('I fetched all users from the team and validate both users are there', async () => {
      const { id } = res.data;

      const res2 = await Team.fetchAllUsersInTeam(
        {
          headers: {
            Authorization: token2,
          },
        },
        id,
      );

      expect(res2.status).toBe(200);
      expect(res2.data.length).toEqual(2);
    });
  });
});
