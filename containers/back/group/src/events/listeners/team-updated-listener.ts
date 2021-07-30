import { Message } from 'node-nats-streaming';
import { Listener, TeamUpdatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { Team } from '../../db/models/Team';

export class TeamUpdatedListener extends Listener<TeamUpdatedEvent> {
  subject: Subjects.TeamUpdated = Subjects.TeamUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TeamUpdatedEvent['data'], msg: Message) {
    console.log('Team updated event data!', data);

    const { id, title, version, profile_id, members } = data;

    const team = await Team.findById(id);

    console.log('Found team', team);

    team.title = title;
    team.version = version;
    team.profile = profile_id;
    team.members = members;

    await team.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
