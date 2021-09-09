import { createRandomProfile } from '../../helpers/createRandomProfile';
import faker from 'faker';
import { Profile } from '../../common/Profile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('updates profile', async (done) => {
    const { token } = await createRandomProfile();
    const handle = faker.name.firstName();
    const avatar = faker.internet.avatar();
    const background = faker.internet.avatar();

    const res = await Profile.updateProfile(
      {
        handle: handle,
        avatar: avatar,
        background: background,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    expect(res.status).toBe(201);
    expect(res.data.data.profile.handle).toEqual(handle);
    expect(res.data.data.profile.avatar).toEqual(avatar);
    expect(res.data.data.profile.background).toEqual(background);

    done();
  });
});
