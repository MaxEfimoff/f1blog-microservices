import { Message } from 'node-nats-streaming';
import { Listener, ProfileCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { Profile, ProfileDoc } from '../../company/schemas/profile.schema';

export class ProfileCreatedListener extends Listener<ProfileCreatedEvent> {
  subject: Subjects.ProfileCreated = Subjects.ProfileCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProfileCreatedEvent['data'], msg: Message) {
    console.log('Profile created event data!', data);

    const { id, handle, version, user_id } = data;
    console.log(data);

    const profile = Profile.build({
      user_id,
      handle,
      id,
      version,
    });

    console.log('Profile company', profile);

    await profile.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
