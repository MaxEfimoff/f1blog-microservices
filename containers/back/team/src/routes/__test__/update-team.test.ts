import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Team } from "../../db/models/Team";
import { Profile } from "../../db/models/Profile";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";
const newTitle = "faketitle";
const secondUserId = 7;
const secondUserName = "newtestusername";
const secondProfileHandle = "newtestprofilehandle";

it("returns 201 after updating team", async () => {
  await createProfile(userId, userName, profileHandle);
  await createProfile(secondUserId, secondUserName, secondProfileHandle);

  const profiles = await Profile.find();

  console.log("Profiles", profiles);

  const token = await login(userId);
  const token2 = await login(secondUserId);

  const teamsNUmber = await Team.find();

  expect(teamsNUmber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();

  expect(teams[0].title).toEqual(title);
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .patch(`/api/v1/teams/${teams[0]._id}`)
    .set("Authorization", token)
    .send({ title: newTitle })
    .expect(201);

  const teamsAfterDeleting = await Team.find();
  console.log("teams", teamsAfterDeleting);

  expect(teamsAfterDeleting[0].title).toEqual(newTitle);
});

it("returns 401 after updating team if user is anauthorized", async () => {
  await createProfile(userId, userName, profileHandle);

  const token = await login(userId);

  const teamsNUmber = await Team.find();

  expect(teamsNUmber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();

  expect(teams[0].title).toEqual(title);
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .patch(`/api/v1/teams/${teams[0]._id}`)
    .send({ title: newTitle })
    .expect(401);
});
