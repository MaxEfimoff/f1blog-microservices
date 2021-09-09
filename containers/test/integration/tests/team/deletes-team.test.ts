import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('deletes team', () => {
  it('deletes team', async (done) => {
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

    const { id } = res.data.data.newTeam;
    const res2 = await Team.deleteTeam(
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    expect(res2.status).toBe(201);

    const deleteedTeamId = res.data.data.newTeam.id;

    const res3 = await Team.fetchAllTeams({
      headers: {
        Authorization: token,
      },
    });
    const foundTeams = res3.data.data.teams;

    const foundTeam = foundTeams.find((team) => team.id === deleteedTeamId);
    expect(foundTeam).toBeUndefined();

    done();
  });
});
