import { Profile } from '../../common/Profile';
import { getAuthToken } from '../../helpers/getAuthToken';

describe('Create and fetch profile tests', () => {
  it('fetches all profiles', async (done) => {
    const token = await getAuthToken('superadmin');

    const res = await Profile.fetchAllProfiles({
      headers: {
        Authorization: token,
      },
    });
    console.log(res.data.data);
    done();
  });
});
