import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('deletes profile', async (done) => {
    const { token } = await createRandomProfile();

    const res = await Profile.deleteProfile({
      headers: {
        Authorization: token,
      },
    });
    const { id } = res.data.data.profile;

    expect(res.status).toBe(201);

    const res2 = await Profile.fetchProfileById(
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    expect(res2.status).toBe(400);
    expect(res2.data.errors[0].message).toEqual('There are no active profile for this user');

    done();
  });
});
