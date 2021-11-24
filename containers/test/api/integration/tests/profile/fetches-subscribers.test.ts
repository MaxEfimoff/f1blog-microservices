import { Profile } from '../../common/Profile';
import { createRandomProfile } from '../../helpers/createRandomProfile';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches subscribers', async (done) => {
    const { token, profileId } = await createRandomProfile();
    const userEmail = faker.internet.email();

    const secondProfile = await createRandomProfile(userEmail);

    const res = await Profile.subscribeToProfile(
      secondProfile.profileId,
      {
        headers: {
          Authorization: token,
        },
      },
      secondProfile.profileId,
    );

    expect(res.status).toBe(201);
    expect(res.data.data.profile.subscribedProfiles[0].id).toEqual(secondProfile.profileId);

    const res2 = await Profile.fetchSubscribers({
      headers: {
        Authorization: secondProfile.token,
      },
    });

    expect(res2.status).toBe(200);
    expect(res2.data.data.subscribers[0]).toEqual(profileId);

    done();
  });
});
