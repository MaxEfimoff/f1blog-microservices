import { createRandomProfile } from '../../helpers/createRandomProfile';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches all profiles', () => {
  it('creates new profile', async (done) => {
    await createRandomProfile();

    done();
  });
});
