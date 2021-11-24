import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('registers random user', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);
    expect(res.data.data.savedUseremail).toBeDefined;
    expect(res.data.data.name).toBeDefined;

    done();
  });
});
