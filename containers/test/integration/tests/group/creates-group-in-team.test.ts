import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Group } from '../../common/Group';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('fetches-all-groups-in-team', () => {
  it('fetches-all-groups-in-team', async (done) => {
    const { token } = await createRandomProfile();
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });

    const { id } = res.data.data.newTeam;

    const groupData = {
      title: faker.company.companyName(),
    };
    const res3 = await Group.createGroup(
      groupData,
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    expect(res3.status).toBe(201);
    expect(res3.data.data.newGroup.team.id).toEqual(id);
    expect(res3.data.data.newGroup.title).toEqual(groupData.title);

    const res4 = await Group.fetchAllGroupsInTeam(
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    expect(res4.status).toBe(200);
    expect(res4.data.data.groups[0].title).toEqual(groupData.title);

    done();
  });
});
