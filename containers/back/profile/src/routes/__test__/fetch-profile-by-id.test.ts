import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Profile } from "../../db/models/Profile";
import { generatedId } from "./helpers/generate-id";

beforeAll(() => {
  createProfile();
});

it("returns 200 on getting profile by id and 401 if user not logged in", async () => {
  const token = await login();

  let profiles = await Profile.find({});

  console.log(profiles);

  let profileid = profiles[0]._id;

  await request(app)
    .get(`/api/v1/profiles/${profileid}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  await request(app).get(`/api/v1/profiles/${profileid}`).expect(401);
});

it("returns 400 on getting profile by id if this id does not exist", async () => {
  const token = await login();

  await request(app)
    .get(`/api/v1/profiles/${generatedId}`)
    .set("Authorization", token)
    .send()
    .expect(400);
});

it("returns 404 on getting profile by id if it was not provided", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/profiles/")
    .set("Authorization", token)
    .send()
    .expect(404);
});
