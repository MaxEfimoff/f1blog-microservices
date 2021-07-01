import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { login } from "./helpers/login";
import { Profile } from "../../db/models/Profile";
import { User } from "../../db/models/User";

it("returns 401 if user is not logged in", async () => {
  return request(app).get("/api/v1/profiles/all").expect(401);
});

it("returns 201 if profile was created successfully", async () => {
  const user = User.build({
    id: 1,
    name: "max",
    version: 0,
  });
  await user.save();

  const token = await login();
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
});
