import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('creates new team', () => {
  it('creates new team', async (done) => {
    const { token } = await createRandomProfile();
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });
    expect(res.status).toBe(201);
    expect(res.data.data.newTeam.title).toEqual(data.title);

    const { title } = res.data.data.newTeam;

    const res2 = await Team.fetchTeamByTitle(
      {
        headers: {
          Authorization: token,
        },
      },
      title,
    );
    expect(res2.status).toBe(200);
    expect(res2.data.data.team.title).toEqual(title);

    done();
  });
});
