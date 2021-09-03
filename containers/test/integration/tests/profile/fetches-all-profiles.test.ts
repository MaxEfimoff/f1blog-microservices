import { getAuthToken } from '../../helpers/getAuthToken';
import { Profile } from '../../common/Profile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches all profiles', async (done) => {
    const token = await getAuthToken('superadmin');

    const res = await Profile.fetchAllProfiles({
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);

    done();
  });
});
