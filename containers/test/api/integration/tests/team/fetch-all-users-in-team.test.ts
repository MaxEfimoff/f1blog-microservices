import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('joines team', () => {
  it('joines team', async (done) => {
    const { token } = await createRandomProfile();
    const userEmail = faker.internet.email();
    const userEmail2 = faker.internet.email();
    const { profileId, token: token2 } = await createRandomProfile(userEmail);
    const { profileId: profileId3, token: token3 } = await createRandomProfile(userEmail2);
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res);
    expect(res.status).toBe(201);

    const { id: teamId } = res.data.data.newTeam;

    const res2 = await Team.joinTeam(
      {},
      {
        headers: {
          Authorization: token2,
        },
      },
      teamId,
    );
    expect(res2.status).toBe(201);

    const res3 = await Team.joinTeam(
      {},
      {
        headers: {
          Authorization: token3,
        },
      },
      teamId,
    );
    expect(res3.status).toBe(201);

    const res4 = await Team.fetchAllUsersInTeam(
      {
        headers: {
          Authorization: token,
        },
      },
      teamId,
    );
    expect(res4.status).toBe(200);

    expect(res4.data.data.teamMembers.find((id) => id === profileId)).toBeDefined();
    expect(res4.data.data.teamMembers.find((id) => id === profileId3)).toBeDefined();
    expect(res4.data.data.teamMembers.length).toEqual(2);

    done();
  });
});
