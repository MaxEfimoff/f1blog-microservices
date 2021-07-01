import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Profile } from "../../db/models/Profile";
import { User } from "../../db/models/User";
import { generatedId } from "./helpers/generate-id";

beforeAll(() => {
  createProfile(3, "dewdwed", "ferferfe");
});

it("returns 201 on deleting profile", async () => {
  // const user = User.build({
  //   id: 1,
  //   name: "max",
  //   version: 0,
  // });
  // await user.save();

  const token = await login();

  let profiles = await Profile.find({});
  let users = await User.find({});

  expect(users.length).toEqual(1);
  expect(profiles.length).toEqual(1);

  await request(app)
    .delete("/api/v1/profiles/")
    .set("Authorization", token)
    .expect(201);

  expect(profiles.length).toEqual(0);
});

it("returns 401 on deleting profile if user is not authenticated", async () => {
  await request(app).delete("/api/v1/profiles/").expect(401);
});

it("returns 404 on deleting profile if id is incorrect", async () => {
  const token = await login();

  await request(app)
    .delete(`/api/v1/profiles/${generatedId}`)
    .set("Authorization", token)
    .expect(404);
});
