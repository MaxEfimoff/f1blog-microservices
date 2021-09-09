import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('changes user password', async (done) => {
    const newPassword = '234567';

    const res = await User.registerRandomUser();
    expect(res.status).toBe(201);
    const { email } = res.data.data.savedUser;

    const res5 = await User.fetchAllConfirmationHashes();
    expect(res5.status).toBe(200);

    const confirmationHashes = res5.data.data.rows;
    const confirmationHash = confirmationHashes[confirmationHashes.length - 1].hash;

    const res7 = await User.activateUser(confirmationHash);
    expect(res7.status).toBe(200);

    const res9 = await User.loginUser({
      email: email,
      password: '123456',
    });

    const { token } = res9.data.data;

    expect(res9.status).toBe(200);

    const res2 = await User.resetPasswordRequest({
      email: email,
    });
    expect(res2.status).toBe(201);

    const res3 = await User.fetchAllResetPasswordHashes();
    expect(res3.status).toBe(200);
    const hashes = res3.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;

    const res38 = await User.fetchAllUsers({
      headers: {
        Authorization: token,
      },
    });
    console.log('Last user', res38.data.data.rows[res38.data.data.rows.length - 1]);
    const data = {
      password: '999999',
    };

    // Change the password
    const res4 = await User.changePassword(data, hash);

    expect(res4.status).toBe(201);
    console.log('change password user', res4.data.data);

    const res6 = await User.loginUser({
      email: email,
      password: '999999',
    });
    //console.log(res4.data.data);
    expect(res6.status).toBe(200);

    done();
  });
});
