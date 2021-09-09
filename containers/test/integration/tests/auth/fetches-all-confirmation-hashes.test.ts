import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches all confirmation hashes', async (done) => {
    const res = await User.fetchAllConfirmationHashes();

    expect(res.status).toBe(200);
    expect(res.data.data.rows).toBeInstanceOf(Array);

    done();
  });
});
