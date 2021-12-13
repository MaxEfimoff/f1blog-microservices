import { Message } from 'node-nats-streaming';
import { UserCreatedEvent } from '@f1blog/common';
import { UserCreatedListener } from '../user-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { User } from '../../../db/models/user.schema';

const setup = async () => {
  // Create an instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: UserCreatedEvent['data'] = {
    id: 34,
    version: 0,
    email: 'vvd@ferf.erg',
    name: 'vbjhbj',
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a user', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a user was created!
  const users = await User.find();

  expect(users[0]).toBeDefined();
  expect(users[0]!.name).toEqual(data.name);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
