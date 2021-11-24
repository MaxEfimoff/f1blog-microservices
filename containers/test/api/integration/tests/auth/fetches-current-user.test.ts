import { User } from '../../common/User';
import { getAuthToken } from '../../helpers/getAuthToken';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches current user', async (done) => {
    const token = await getAuthToken();

    const res = await User.fetchCurrentUser({
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.data.id).toBeDefined();
    expect(res.data.data.name).toBeDefined();
    expect(res.data.data.role).toEqual('user');

    done();
  });
});
