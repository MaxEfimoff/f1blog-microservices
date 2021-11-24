import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches profile by handle', async (done) => {
    const { token, profileHandle } = await createRandomProfile();

    const res = await Profile.fetchProfileByHandle(
      {
        headers: {
          Authorization: token,
        },
      },
      profileHandle,
    );

    expect(res.status).toBe(200);

    done();
  });
});
