import { User } from '../common/User';

const getAuthToken = async () => {
  const res = await User.registerRandomUser();

  const { name } = res.data.data.savedUser;

  const res2 = await User.fetchAllConfirmationHashes();
  const hashes = res2.data.data.rows;
  const hash = hashes[hashes.length - 1].hash;

  const res3 = await User.activateUser(hash);

  const res4 = await User.loginUser({
    email: res3.data.data.updatedUser.email,
    password: '123456',
  });

  return res4.data.data.token;
};

export { getAuthToken };
