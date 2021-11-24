import { User } from '../../common/User';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('changes user email', async (done) => {
    const res = await User.registerRandomUser();

    expect(res.status).toBe(201);

    const { email } = res.data.data.savedUser;

    const res2 = await User.fetchAllConfirmationHashes();
    expect(res2.status).toBe(200);

    const confirmationHashes = res2.data.data.rows;

    const confirmationHash = confirmationHashes[confirmationHashes.length - 1].hash;

    // Activate user
    const res3 = await User.activateUser(confirmationHash);
    expect(res3.status).toBe(200);

    // Login user
    const res4 = await User.loginUser({
      email: email,
      password: '123456',
    });

    expect(res4.status).toBe(200);
    const { token } = res4.data.data;

    // Send request to change the email
    const res5 = await User.changeEmailRequest(
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );

    expect(res5.status).toBe(201);

    // Fetch hash for changing the email
    const res6 = await User.fetchAllChangeEmailHashes();
    expect(res6.status).toBe(200);

    const hashes = res6.data.data.rows;
    const hash = hashes[hashes.length - 1].hash;
    const newEmail = faker.internet.email();

    // Change the email
    const res7 = await User.changeEmail(
      hash,
      { email: newEmail },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    expect(res7.status).toBe(201);

    const res8 = await User.fetchAllUsers({
      headers: {
        Authorization: token,
      },
    });

    expect(res8.data.data.rows[res8.data.data.rows.length - 1].email).toEqual(newEmail);

    done();
  });
});
