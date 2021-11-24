import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('unsubscribes from a profile', async (done) => {
    const { token } = await createRandomProfile();
    const userEmail = faker.internet.email();

    const { profileId } = await createRandomProfile(userEmail);

    const res = await Profile.subscribeToProfile(
      profileId,
      {
        headers: {
          Authorization: token,
        },
      },
      profileId,
    );

    expect(res.status).toBe(201);
    expect(res.data.data.profile.subscribedProfiles[0].id).toEqual(profileId);

    const res2 = await Profile.unsubscribeFromProfile(
      profileId,
      {
        headers: {
          Authorization: token,
        },
      },
      profileId,
    );
    expect(res2.status).toBe(201);

    expect(res2.data.data.profile.subscribedProfiles[0]).toBeUndefined();
    done();
  });
});
