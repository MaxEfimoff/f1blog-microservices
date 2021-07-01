import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Profile } from "../../db/models/Profile";
import { User } from "../../db/models/User";

beforeAll(async () => {
  createProfile();
});

it("returns 201 on updating current profile if user is logged in", async () => {
  const token = await login();
  const handle = "new-handle";
  const avatar = "new-avatar";
  const background = "new-background";

  await request(app)
    .patch("/api/v1/profiles/")
    .set("Authorization", token)
    .send({ handle: handle, avatar: avatar, background: background })
    .expect(201);

  let profile = await Profile.findOne({ handle: handle });

  expect(profile.handle).toEqual(handle);
  expect(profile.avatar).toEqual(avatar);
  expect(profile.background).toEqual(background);
});
