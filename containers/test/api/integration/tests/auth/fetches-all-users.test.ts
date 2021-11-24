import { User } from '../../common/User';
import { getAuthToken } from '../../helpers/getAuthToken';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches all users', async (done) => {
    const token = await getAuthToken();

    const res = await User.fetchAllUsers({
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.data.rows).toBeInstanceOf(Array);

    done();
  });
});
