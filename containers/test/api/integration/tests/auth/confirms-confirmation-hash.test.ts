import { User } from '../../common/User';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
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
});
