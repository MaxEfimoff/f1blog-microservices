import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { Profile } from "../../db/models/Profile";
import { User } from "../../db/models/User";
import { natsWrapper } from "../../nats-wrapper";

const userId = 1;

it("returns 401 if user is not logged in", async () => {
  return request(app).get("/api/v1/profiles/all").expect(401);
});

it("returns 201 if profile was created successfully", async () => {
  const user = User.build({
    id: userId,
    name: "max",
    version: 0,
  });
  await user.save();

  const token = await login(userId);
  const handle = "gdfgd";

  let profiles = await Profile.find({});
  let users = await User.find({});

  expect(users.length).toEqual(1);
  expect(profiles.length).toEqual(0);

  await request(app)
    .post("/api/v1/profiles")
    .set("Authorization", token)
    .send({ handle: handle })
    .expect(201);

  let profile = await Profile.findOne({ handle: handle });

  expect(profile.handle).toEqual(handle);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
