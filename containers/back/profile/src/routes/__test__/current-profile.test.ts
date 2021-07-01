import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Profile } from "../../db/models/Profile";
import { User } from "../../db/models/User";

beforeAll(async () => {
  createProfile();
});

it("returns 200 on getting current profile if user is logged in", async () => {
  const token = await login();

  let profiles = await Profile.find({});
  let users = await User.find({});

  await request(app)
    .get("/api/v1/profiles/current")
    .set("Authorization", token)
    .send()
    .expect(200);
});
