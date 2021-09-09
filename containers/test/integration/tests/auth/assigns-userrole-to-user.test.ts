import { User } from '../../common/User';
import { Userroles } from '../../common/Userrole';
import { getAuthToken } from '../../helpers/getAuthToken';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('assigns userrole to user and fetches users by userrole', async (done) => {
    const token = await getAuthToken();
    const role = 'admin';

    const res = await User.fetchCurrentUser({
      headers: {
        Authorization: token,
      },
    });

    const { id } = res.data.data;

    const res2 = await Userroles.assignRoleToUser(id, role, {
      headers: {
        Authorization: token,
      },
    });

    expect(res2.status).toBe(200);
    expect(res2.data.data.updatedUser.role).toEqual(role);
    expect(res2.data.data.updatedUser.user_id).toEqual(id);

    const res3 = await Userroles.fetchUsersByUserrole(role);
    const { foundUsers } = res3.data.data;
    expect(foundUsers).toBeInstanceOf(Array);
    expect(foundUsers[foundUsers.length - 1].user_id).toEqual(id);

    done();
  });
});
