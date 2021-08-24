import { User } from '../common/User';
import { Userroles } from '../common/Userrole';

const getAuthToken = async (role: string = 'user') => {
  let token: string;

  const res = await User.registerRandomUser();

  const res2 = await User.fetchAllConfirmationHashes();
  const hashes = res2.data.data.rows;
  const hash = hashes[hashes.length - 1].hash;

  const res3 = await User.activateUser(hash);

  const res4 = await User.loginUser({
    email: res3.data.data.updatedUser.email,
    password: '123456',
  });

  token = res4.data.data.token;

  const res5 = await User.fetchCurrentUser({
    headers: {
      Authorization: token,
    },
  });

  const { id } = res5.data.data;

  console.log(token, res4.data.data);

  if (role !== 'user') {
    const res6 = await Userroles.assignRoleToUser(id, role, {
      headers: {
        Authorization: token,
      },
    });

    expect(res6.status).toBe(200);
    expect(res6.data.data.updatedUser.role).toEqual(role);
    expect(res6.data.data.updatedUser.user_id).toEqual(id);
  }

  const res7 = await User.loginUser({
    email: res3.data.data.updatedUser.email,
    password: '123456',
  });

  return res7.data.data.token;
};

export { getAuthToken };
