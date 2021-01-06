import { Message } from 'node-nats-streaming';
import { Listener, FetchAllNewsItemsEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';

export class FetchAllNewsItemsListener extends Listener<
  FetchAllNewsItemsEvent
> {
  subject: Subjects.FetchAllNewsItems = Subjects.FetchAllNewsItems;
  queueGroupName = queueGroupName;

  async onMessage(data: FetchAllNewsItemsEvent['data'], msg: Message) {
    console.log('Fetch all newsitems created event data!', data);

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
