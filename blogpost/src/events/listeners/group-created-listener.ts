import { Message } from 'node-nats-streaming';
import { Listener, GroupCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { Group } from '../../db/models/Group';
import { Profile } from '../../db/models/Profile';

export class GroupCreatedListener extends Listener<GroupCreatedEvent> {
  subject: Subjects.GroupCreated = Subjects.GroupCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: GroupCreatedEvent['data'], msg: Message) {
    console.log('Blogpost:Group created event data!', data);

    const { id, title, version, profile_id } = data;

    const profile = await Profile.findOne({ _id: profile_id });

    const group = Group.build({
      profile,
      title,
      version,
      id,
    });

    await group.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
