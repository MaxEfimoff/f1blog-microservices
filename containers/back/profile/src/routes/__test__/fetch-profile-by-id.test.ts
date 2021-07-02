import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { generatedId } from "./helpers/generate-id";

const userId = 7;
const name = "fakename";
const handle = "fakehandle";

beforeAll(() => {
  createProfile(userId, name, handle);
});

it("returns 200 on getting profile by id and 401 if user not logged in", async () => {
  const token = await login(userId);

  const res = await request(app)
    .get("/api/v1/profiles/all")
    .set("Authorization", token)
    .send()
    .expect(200);

  let profileid = res.body.data.profiles[0].id;

  const res2 = await request(app)
    .get(`/api/v1/profiles/${profileid}`)
    .set("Authorization", token)
    .send()
    .expect(200);

  expect(res2.body.data.profile.handle).toEqual(handle);

  await request(app).get(`/api/v1/profiles/${profileid}`).expect(401);
});

it("returns 400 on getting profile by id if this id does not exist", async () => {
  const token = await login(userId);

  await request(app)
    .get(`/api/v1/profiles/${generatedId}`)
    .set("Authorization", token)
    .send()
    .expect(400);
});

it("returns 404 on getting profile by id if it was not provided", async () => {
  const token = await login(userId);

  await request(app)
    .get("/api/v1/profiles/")
    .set("Authorization", token)
    .send()
    .expect(404);
});
