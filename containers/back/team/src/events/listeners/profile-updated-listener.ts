import { Message } from 'node-nats-streaming';
import { Listener, ProfileUpdatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-team-name';
import { Profile } from '../../db/models/Profile';

export class ProfileUpdatedListener extends Listener<ProfileUpdatedEvent> {
  subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProfileUpdatedEvent['data'], msg: Message) {
    console.log('Team:Profile updated event data!', data);

    const { id, handle, version } = data;

    const profile = await Profile.findById({ _id: id });

    console.log(profile);

    profile.handle = handle;
    profile.version = version;
    // profile.avatar = avatar;
    // profile.background = background;

    await profile.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
