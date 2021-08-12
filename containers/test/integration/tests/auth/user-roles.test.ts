import faker from 'faker';
import { Userroles } from '../../common/Userrole';
import { User } from '../../common/User';
import { getAuthToken } from '../../helpers/getAuthToken';

describe('Create and fetch user role tests', () => {
  it('fetches all user roles', async (done) => {
    const res = await Userroles.fetchAllUserRoles();

    expect(res.status).toBe(200);
    expect(res.data.data.rows).toBeInstanceOf(Array);
    expect(res.data.data.rows[0].role).toEqual('superadmin');
    expect(res.data.data.rows[1].role).toEqual('admin');
    expect(res.data.data.rows[2].role).toEqual('user');
    done();
  });

  it('creates userrole', async (done) => {
    const token = await getAuthToken();
    const role: string = faker.commerce.productName();
    const description: string = faker.commerce.productDescription();

    const res = await Userroles.createUserRole(
      {
        role: role,
        description: description,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    expect(res.status).toBe(201);
    expect(res.data.data.savedRole.email).toEqual(role);
    expect(res.data.data.savedRole.name).toEqual(description);
    done();
  });

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
