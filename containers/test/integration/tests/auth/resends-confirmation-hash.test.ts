import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('resends confirmation hashes', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);
    const { email } = res.data.data.savedUser;

    const res2 = await User.resendConfirmationHash({
      email: email,
    });
    expect(res2.status).toBe(201);

    done();
  });
});
