import { Message } from 'node-nats-streaming';
import { Listener, TeamCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { Team } from '../../db/models/Team';

export class TeamCreatedListener extends Listener<TeamCreatedEvent> {
  subject: Subjects.TeamCreated = Subjects.TeamCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TeamCreatedEvent['data'], msg: Message) {
    console.log('Team created event data!', data);

    const { id, title, version, profile_id } = data;

    const team = Team.build({
      profile_id,
      title,
      id,
      version,
    });

    await team.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
