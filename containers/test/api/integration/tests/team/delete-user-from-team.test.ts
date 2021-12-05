import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('joines team', () => {
  it('joines team', async (done) => {
    const { token } = await createRandomProfile();
    const userEmail = faker.internet.email();
    const { profileId, token: token2 } = await createRandomProfile(userEmail);
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(201);
    const { id: teamId } = res.data;

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
    expect(res2.data.members[0]).toEqual(profileId);

    const res3 = await Team.deleteUserFromTeam(
      {
        headers: {
          Authorization: token,
        },
      },
      teamId,
      profileId,
    );
    expect(res2.status).toBe(201);
    console.log(res3.data);
    expect(res3.data.members[0]).toBeUndefined();

    done();
  });
});
