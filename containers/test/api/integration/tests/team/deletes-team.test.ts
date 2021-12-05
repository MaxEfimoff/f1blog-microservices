import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Profile } from '../../common/Profile';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('deletes team', () => {
  it('deletes team', async (done) => {
    const steps: string[] = [];
    steps.push('Step 1. Creates profile.');
    const { token } = await createRandomProfile();
    const data = {
      title: faker.company.companyName(),
    };

    steps.push('Step 2. Creates new team.');
    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(201);

    steps.push('Step 3. Deletes team.');
    const { id } = res.data;
    const res2 = await Team.deleteTeam(
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    expect(res2.status).toBe(200);

    const deleteedTeamId = res.data.id;

    steps.push('Step 4. Fetches all teams.');
    const res3 = await Team.fetchAllTeams({
      headers: {
        Authorization: token,
      },
    });

    const foundTeams = res3.data;

    const foundTeam = foundTeams.find((team) => team.id === deleteedTeamId);
    steps.push('Step 5. Validates that deleted team does not exist.');
    expect(foundTeam).toBeUndefined();

    console.log(steps);
    done();
  });
});
