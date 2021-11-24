import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches current profile', async (done) => {
    const { token } = await createRandomProfile();

    const res = await User.fetchCurrentUser({
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);

    const res2 = await Profile.fetchCurrentProfile({
      headers: {
        Authorization: token,
      },
    });

    expect(res2.status).toBe(200);
    expect(res.data.data.name).toEqual(res2.data.data.profile.user.name);

    done();
  });
});
