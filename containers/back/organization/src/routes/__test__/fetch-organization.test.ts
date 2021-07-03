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

it("returns 200 on fetching the organization", async () => {
  const token = await login(userId);

  const res = await request(app)
    .post("/api/v1/organization/")
    .set("Authorization", token)
    .send({ title: title, website: website })
    .expect(201);

  expect(res.body.data.newOrganization.title).toEqual(title);
  expect(res.body.data.newOrganization.website).toEqual(website);
  expect(res.body.data.newOrganization.profile.handle).toEqual(profileHandle);

  console.log("ID", res.body.data);

  const res2 = await request(app)
    .get(`/api/v1/organization/`)
    .set("Authorization", token)
    .expect(200);

  console.log("BODY", res2.body.data.organization[0]);

  expect(res2.body.data.organization[0].title).toEqual(title);
  expect(res2.body.data.organization[0].website).toEqual(website);
});
