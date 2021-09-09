import { Profile } from '../common/Profile';
import { User } from '../common/User';
import faker from 'faker';

const createRandomProfile = async (userEmail?: string) => {
  const res = await User.registerRandomUser(userEmail);

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
  expect(res4.status).toBe(200);
  const { token } = res4.data.data;

  try {
    const res5 = await Profile.createProfile(
      {
        handle: faker.internet.userName(),
        avatar: faker.internet.avatar(),
        background: faker.internet.avatar(),
        status: faker.internet.domainName(),
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    expect(res5.status).toBe(201);
    const profileId = res5.data.data.newProfile.id;
    const profileHandle = res5.data.data.newProfile.handle;

    return { token, profileHandle, profileId };
  } catch (err) {
    console.log(err);
  }
};

export { createRandomProfile };
