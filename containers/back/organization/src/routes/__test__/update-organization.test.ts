import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";
const website = "test.test";
const newTitle = "newtitle";
const newWebsite = "newwebsite";

beforeAll(() => {
  createProfile(userId, userName, profileHandle);
});

it("returns 201 on updation the organization", async () => {
  const token = await login(userId);

  const res = await request(app)
    .post("/api/v1/organization/")
    .set("Authorization", token)
    .send({ title: title, website: website })
    .expect(201);

  expect(res.body.data.newOrganization.title).toEqual(title);
  expect(res.body.data.newOrganization.website).toEqual(website);
  expect(res.body.data.newOrganization.profile.handle).toEqual(profileHandle);

  const res2 = await request(app)
    .patch(`/api/v1/organization/${res.body.data.newOrganization.id}`)
    .set("Authorization", token)
    .send({ title: newTitle, website: newWebsite })
    .expect(201);

  console.log("BODY", res2.body.data);

  expect(res2.body.data.organization.title).toEqual(newTitle);
  expect(res2.body.data.organization.website).toEqual(newWebsite);
});
