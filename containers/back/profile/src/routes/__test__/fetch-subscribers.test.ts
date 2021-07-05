import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";

const firstUserId = 4;
const firstUserName = "fakename";
const firstProfileHandle = "fakehandle";

const secondUserId = 5;
const secondUserName = "anotherfakename";
const secondProfileHandle = "anotherfakehandle";

beforeAll(async () => {
  createProfile(firstUserId, firstUserName, firstProfileHandle);
  createProfile(secondUserId, secondUserName, secondProfileHandle);
});

it("returns 200 on getting current subscribers if user is logged in and 401 ai not logged in", async () => {
  // Logging in with first user
  const firstToken = await login(firstUserId);

  const res = await request(app)
    .get("/api/v1/profiles/current")
    .set("Authorization", firstToken)
    .expect(200);

  expect(res.body.data.profile.user.name).toEqual(firstUserName);
  expect(res.body.data.profile.handle).toEqual(firstProfileHandle);

  // Getting first user profile
  const firstProfileId = res.body.data.profile.id;

  // Logging in with second user
  const secondToken = await login(secondUserId);

  const secondRes = await request(app)
    .get("/api/v1/profiles/current")
    .set("Authorization", secondToken)
    .expect(200);

  expect(secondRes.body.data.profile.user.name).toEqual(secondUserName);
  expect(secondRes.body.data.profile.handle).toEqual(secondProfileHandle);

  // Getting second user profile
  const secondProfileId = secondRes.body.data.profile.id;

  // Subscribing second user on the first one
  const thirdRes = await request(app)
    .post(`/api/v1/profiles/subscribe/${firstProfileId}`)
    .set("Authorization", secondToken)
    .expect(201);

  expect(thirdRes.body.data.profile.subscribedProfiles[0].id).toEqual(
    firstProfileId
  );

  // Checkig if the second user is in the subscribers of the first one
  const fourthRes = await request(app)
    .get("/api/v1/profiles/subscribers")
    .set("Authorization", firstToken)
    .expect(200);

  expect(fourthRes.body.data.subscribers[0]).toEqual(secondProfileId);

  await request(app).get("/api/v1/profiles/subscribers").expect(401);
});
