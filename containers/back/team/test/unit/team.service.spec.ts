import { Test } from '@nestjs/testing';
import { TeamService } from '../../src/team/team.service';
import { createProfile } from '../helpers/create-profile';
import * as faker from 'faker';
import { UpdateTeamDto } from 'src/team/dto/update-team.dto';
import { natsWrapper } from '../../src/nats-wrapper';

jest.mock('../../src/nats-wrapper');

beforeAll(() => jest.setTimeout(150 * 1000));
describe('TeamService', () => {
  let service: TeamService;
  const id = faker.datatype.number();
  const userName = faker.name.firstName();
  const profileHandle = faker.name.lastName();
  const title = 'testtitle';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TeamService],
    }).compile();

    service = module.get(TeamService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new team', async () => {
    const profile = await createProfile(id, userName, profileHandle);
    const team = await service.createTeam({ title: title }, profile);

    expect(team.title).toEqual(title);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it('updates team', async () => {
    const newTitle = 'newTitle';
    const newDescription = 'newDescription';
    const newAvatar = 'newAvatar';

    const updatedTeam: UpdateTeamDto = {
      title: newTitle,
      description: newDescription,
      avatar: newAvatar,
    };

    const profile = await createProfile(id, userName, profileHandle);
    const team = await service.createTeam({ title: title }, profile);

    expect(team.title).toEqual(title);

    const res = await service.updateTeam(updatedTeam, team.id, profile);
    console.log(res);
  });
});
