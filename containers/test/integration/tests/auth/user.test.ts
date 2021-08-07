import { User } from '../../common/User';
import { getAuthToken } from '../../helpers/getAuthToken';

describe('Create and fetch user tests', () => {
  it('registers random user', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);
    expect(res.data.data.savedUseremail).toBeDefined;
    expect(res.data.data.name).toBeDefined;

    done();
  });

  it('fetches all confirmation hashes', async (done) => {
    const res = await User.fetchAllConfirmationHashes();

    expect(res.status).toBe(200);
    expect(res.data.data.rows).toBeInstanceOf(Array);

    done();
  });

  it('confirms registered user confirmation hash', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);
    const { savedUseremail, name } = res.data.data;

    const res2 = await User.fetchAllConfirmationHashes();
    expect(res2.status).toBe(200);
    const hashes = res2.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;

    const res3 = await User.activateUser(hash);
    expect(res3.data.data.email).toEqual(savedUseremail);
    expect(res3.data.data.name).toEqual(name);

    done();
  });

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
    expect(res9.status).toBe(200);

    const res2 = await User.resetPasswordRequest({
      email: email,
    });
    expect(res2.status).toBe(201);

    const res3 = await User.fetchAllResetPasswordHashes();
    expect(res3.status).toBe(200);
    const hashes = res3.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;

    const res4 = await User.changePassword(hash, { password: newPassword });
    expect(res4.status).toBe(201);

    await sleep(1000);

    const res6 = await User.loginUser({
      email: email,
      password: newPassword,
    });
    expect(res6.status).toBe(200);

    done();
  });

  it('changes user email', async (done) => {
    const res = await User.registerRandomUser();
    expect(res.status).toBe(201);
    const { email } = res.data.data.savedUser;

    const res2 = await User.fetchAllConfirmationHashes();
    expect(res2.status).toBe(200);

    const confirmationHashes = res2.data.data.rows;
    const confirmationHash = confirmationHashes[confirmationHashes.length - 1].hash;

    const res3 = await User.activateUser(confirmationHash);
    expect(res3.status).toBe(200);

    const res4 = await User.loginUser({
      email: email,
      password: '123456',
    });
    await console.log(res4.data);

    expect(res4.status).toBe(200);
    const { token } = res4.data.data;

    const res5 = await User.changeEmailRequest({
      headers: {
        Authorization: token,
      },
    });

    expect(res5.status).toBe(200);

    const res6 = await User.fetchAllChangeEmailHashes();
    expect(res6.status).toBe(200);
    await console.log(res6.data);
    const hashes = res6.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;

    const res7 = await User.changeEmail(hash, {
      headers: {
        Authorization: token,
      },
    });
    console.log('res7', res7.data);
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
