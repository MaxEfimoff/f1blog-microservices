import { createRandomProfile } from '../../helpers/createRandomProfile';
import { Group } from '../../common/Group';
import { Team } from '../../common/Team';
import faker from 'faker';

beforeAll(() => jest.setTimeout(150 * 1000));

describe('join-group-in-team', () => {
  it('join-group-in-team', async (done) => {
    const email = faker.internet.email();
    const { token, profileId } = await createRandomProfile();
    const { token: token2, profileId: profileId2 } = await createRandomProfile(email);
    const data = {
      title: faker.company.companyName(),
    };

    const res = await Team.createTeam(data, {
      headers: {
        Authorization: token,
      },
    });

    const { id } = res.data.data.newTeam;

    const res2 = await Team.joinTeam(
      {},
      {
        headers: {
          Authorization: token,
        },
      },
      id,
    );
    console.log(res2.data);
    expect(res2.status).toBe(201);
    expect(res2.data.data.team.members[0].id).toEqual(profileId);

    // Second user joins team
    const res5 = await Team.joinTeam(
      {},
      {
        headers: {
          Authorization: token2,
        },
      },
      id,
    );
    expect(res5.status).toBe(201);

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
    expect(res3.data.data.newGroup.team.members[0]).toBeUndefined();
    expect(res3.data.data.newGroup.team.id).toEqual(id);
    expect(res3.data.data.newGroup.title).toEqual(groupData.title);

    const { id: groupId } = res3.data.data.newGroup;

    const res4 = await Group.joinGroup(
      {},
      {
        headers: {
          Authorization: token2,
        },
      },
      id,
      groupId,
    );

    expect(res4.status).toBe(201);
    expect(res4.data.data.group.title).toEqual(groupData.title);
    expect(res4.data.data.group.members[0].id).toEqual(profileId2);

    done();
  });
});
