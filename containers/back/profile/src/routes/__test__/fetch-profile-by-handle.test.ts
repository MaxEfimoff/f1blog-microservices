import request from "supertest";
import { app } from "../../app";
import { createProfile } from "./helpers/create-profile";
import { login } from "./helpers/login";
import { Profile } from "../../db/models/Profile";

beforeAll(() => {
  createProfile();
});

it("returns 200 on getting profile by handle", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/profiles/handle/sweet")
    .set("Authorization", token)
    .send()
    .expect(200);
});

it("returns 401 on getting profile by handle if user is bot logged in", async () => {
  await request(app).get("/api/v1/profiles/handle/max").expect(401);
});

it("returns 400 on getting profile by handle if this handle does not exist", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/profiles/handle/max5")
    .set("Authorization", token)
    .send()
    .expect(400);
});

it("returns 400 on getting profile by handle if it was not provided", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/profiles/handle/")
    .set("Authorization", token)
    .send()
    .expect(400);
});
