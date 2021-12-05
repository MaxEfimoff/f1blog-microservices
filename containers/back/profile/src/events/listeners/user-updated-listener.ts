import { Message } from 'node-nats-streaming';
import { Listener, UserUpdatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from '../queue-group-name';
import { User } from '../../db/models/user.schema';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    console.log('Profile:User updated event data!', data);

    const { id, name, version } = data;

    const user = await User.findOne({ id: id });

    console.log('FOUND', user);

    user.name = name;
    user.version = version - 1;

    // TODO FIX VERSIONING
    await user.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
