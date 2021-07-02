import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";

const userId = 4;
const name = "fakename";
const handle = "fakehandle";

beforeAll(async () => {
  createProfile(userId, name, handle);
});

it("returns 200 on getting current profile if user is logged in", async () => {
  const token = await login(userId);

  const res = await request(app)
    .get("/api/v1/profiles/current")
    .set("Authorization", token)
    .expect(200);

  expect(res.body.data.profile.user.name).toEqual(name);
  expect(res.body.data.profile.handle).toEqual(handle);
});

it("returns 401 on getting current profile if user is not logged in", async () => {
  await request(app).get("/api/v1/profiles/current").expect(401);
});
