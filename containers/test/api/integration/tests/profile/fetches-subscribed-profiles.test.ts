import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches subscribed profiles', () => {
  it('fetches subscribed profiles', async (done) => {
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

    const res2 = await Profile.fetchSubscribedProfiles({
      headers: {
        Authorization: token,
      },
    });

    expect(res2.status).toBe(200);
    expect(res2.data.data.subscribedProfiles[0]).toEqual(profileId);

    done();
  });
});
