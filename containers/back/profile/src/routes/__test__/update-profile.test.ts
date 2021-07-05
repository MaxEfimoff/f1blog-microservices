import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { natsWrapper } from "../../nats-wrapper";

const userId = 1;
const handle = "new-handle";
const avatar = "new-avatar";
const background = "new-background";

beforeAll(async () => {
  createProfile(userId);
});

it("returns 201 on updating current profile if user is logged in", async () => {
  const token = await login(userId);

  const res = await request(app)
    .patch("/api/v1/profiles/")
    .set("Authorization", token)
    .send({ handle: handle, avatar: avatar, background: background })
    .expect(201);

  expect(res.body.data.profile.handle).toEqual(handle);
  expect(res.body.data.profile.avatar).toEqual(avatar);
  expect(res.body.data.profile.background).toEqual(background);
  expect(res.body.data.profile.version).toEqual(0);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const res1 = await request(app)
    .get("/api/v1/profiles/all")
    .set("Authorization", token)
    .expect(200);

  console.log(res1.body.data);

  expect(res1.body.data.profiles[0].version).toEqual(1);
});

it("returns 401 on updating current profile if user is not logged in", async () => {
  await request(app)
    .patch("/api/v1/profiles/")
    .send({ handle: handle, avatar: avatar, background: background })
    .expect(401);
});
