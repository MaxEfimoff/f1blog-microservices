import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches-all-teams', () => {
  it('fetches-all-teams', async (done) => {
    const { token } = await createRandomProfile();

    const res3 = await Team.fetchAllTeams({
      headers: {
        Authorization: token,
      },
    });
    expect(res3.status).toBe(200);
    expect(res3.data.data.teams).toBeInstanceOf(Array);

    done();
  });
});
