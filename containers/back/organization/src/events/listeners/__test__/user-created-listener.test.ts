import { Message } from "node-nats-streaming";
import { ProfileCreatedEvent } from "@f1blog/common";
import { ProfileCreatedListener } from "../profile-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Profile } from "../../../db/models/Profile";
import { generatedId } from "../../../routes/__test__/helpers/generate-id";

const setup = async () => {
  // Create an instance of the listener
  const listener = new ProfileCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: ProfileCreatedEvent["data"] = {
    id: generatedId,
    version: 0,
    handle: "vdfvdv",
    user_id: "vbjhbj",
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a profile", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a profile was created!
  const profiles = await Profile.find();

  expect(profiles[0]).toBeDefined();
  expect(profiles[0]!.handle).toEqual(data.handle);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
