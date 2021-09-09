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
    const { token: token3 } = await createRandomProfile(userEmail2);
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(201);

    await Team.createTeam(data, {
      headers: {
        Authorization: token3,
      },
    });

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

    const res4 = await Team.fetchMyTeams({
      headers: {
        Authorization: token2,
      },
    });
    expect(res4.status).toBe(200);
    expect(res4.data.data.myTeams[0].id).toEqual(teamId);
    expect(res4.data.data.myTeams[0].members[0]).toEqual(profileId);

    done();
  });
});
