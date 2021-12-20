import { Message } from 'node-nats-streaming';
import { Listener, ProfileDeletedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from '../queue-group-name';
import { Profile } from '../../story/schemas/profile.schema';

export class ProfileDeletedListener extends Listener<ProfileDeletedEvent> {
  subject: Subjects.ProfileDeleted = Subjects.ProfileDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ProfileDeletedEvent['data'], msg: Message) {
    console.log('Profile deleted event data!', data);

    const { id } = data;
    console.log('ID ', id);

    const profile = await Profile.findByIdAndRemove({ _id: id });

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
