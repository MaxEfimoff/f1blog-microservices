import { Message } from 'node-nats-streaming';
import { Listener, UserCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../db/models/User';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('User created event data!', data);

    let { id, name, version } = data;

    const user = User.build({
      name,
      id,
      version,
    });

    await user.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
