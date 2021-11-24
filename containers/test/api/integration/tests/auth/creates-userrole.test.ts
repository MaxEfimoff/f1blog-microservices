import faker from 'faker';
import { Userroles } from '../../common/Userrole';
import { getAuthToken } from '../../helpers/getAuthToken';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
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
});
