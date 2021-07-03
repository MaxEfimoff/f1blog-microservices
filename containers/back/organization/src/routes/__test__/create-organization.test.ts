import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";
const website = "test.test";

beforeAll(() => {
  createProfile(userId, userName, profileHandle);
});

it("returns 201 on creating the organization", async () => {
  const token = await login(userId);

  const res = await request(app)
    .post("/api/v1/organization/")
    .set("Authorization", token)
    .send({ title: title, website: website })
    .expect(201);

  expect(res.body.data.newOrganization.title).toEqual(title);
  expect(res.body.data.newOrganization.website).toEqual(website);
  expect(res.body.data.newOrganization.profile.handle).toEqual(profileHandle);
});

it("returns 400 on creating the organization without title", async () => {
  const token = await login(userId);

  await request(app)
    .post("/api/v1/organization/")
    .set("Authorization", token)
    .send({ title: "", website: website })
    .expect(400);
});

it("returns 400 on creating the organization without website", async () => {
  const token = await login(userId);

  await request(app)
    .post("/api/v1/organization/")
    .set("Authorization", token)
    .send({ title: title, website: "" })
    .expect(400);
});

it("returns 401 on creating the organization if not authorized", async () => {
  await request(app)
    .post("/api/v1/organization/")
    .send({ title: title, website: website })
    .expect(401);
});
