import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';
import { Organization } from '../../common/Organization';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('deletes profile', async (done) => {
    const { token } = await createRandomProfile();
    const data = {
      title: faker.company.companyName,
      website: faker.internet.domainName,
    };

    const res = await Organization.createOrganization(data, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res);
    expect(res.status).toBe(201);

    done();
  });
});
