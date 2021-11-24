import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('logs in user', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);
    expect(res.data.data.savedUser.savedUseremail).toBeDefined;
    expect(res.data.data.savedUser.name).toBeDefined;
    const { savedUseremail, name } = res.data.data.savedUser;

    const res2 = await User.fetchAllConfirmationHashes();
    expect(res2.status).toBe(200);
    const hashes = res2.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;

    const res3 = await User.activateUser(hash);
    expect(res3.status).toBe(200);
    expect(res3.data.data.updatedUser.name).toEqual(name);

    const res4 = await User.loginUser({
      email: res3.data.data.updatedUser.email,
      password: '123456',
    });
    expect(res4.status).toBe(200);
    expect(res4.data.status).toEqual('success');
    expect(res4.data.data.token).toBeDefined();

    done();
  });
});
