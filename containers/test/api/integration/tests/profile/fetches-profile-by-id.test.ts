import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches profile by id', async (done) => {
    const { token, profileId } = await createRandomProfile();

    const res = await Profile.fetchProfileById(
      {
        headers: {
          Authorization: token,
        },
      },
      profileId,
    );
    expect(res.status).toBe(200);

    done();
  });
});
