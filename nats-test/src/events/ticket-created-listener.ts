import { Message } from 'node-nats-streaming';
import { Listener, UserCreatedEvent, Subjects } from '@f1blog/common';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = 'payments-service';

  onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.name);
    console.log(data.email);

    msg.ack();
  }
}
