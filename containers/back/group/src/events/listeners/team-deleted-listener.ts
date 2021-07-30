import { Message } from 'node-nats-streaming';
import { Listener, TeamDeletedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { Team } from '../../db/models/Team';

export class TeamDeletedListener extends Listener<TeamDeletedEvent> {
  subject: Subjects.TeamDeleted = Subjects.TeamDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TeamDeletedEvent['data'], msg: Message) {
    console.log('Team deleted event data!', data);

    const { id } = data;

    const team = await Team.findById({ _id: id });

    console.log('Found team', team);

    await Team.findByIdAndRemove({ _id: id });

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
