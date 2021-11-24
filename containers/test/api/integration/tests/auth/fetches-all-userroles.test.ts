import { Userroles } from '../../common/Userrole';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('fetches all user roles', async (done) => {
    const res = await Userroles.fetchAllUserRoles();

    expect(res.status).toBe(200);
    expect(res.data.data.rows).toBeInstanceOf(Array);
    expect(res.data.data.rows[0].role).toEqual('superadmin');
    expect(res.data.data.rows[1].role).toEqual('admin');
    expect(res.data.data.rows[2].role).toEqual('user');
    done();
  });
});
