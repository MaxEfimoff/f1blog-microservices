import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Team } from "../../db/models/Team";
import { Profile } from "../../db/models/Profile";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";

it("returns 201 after user joines a team", async () => {
  await createProfile(userId, userName, profileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const token = await login(userId);
  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();
  const team = teams[0];

  expect(team.title).toEqual(title);
  expect(team.members[0]).toBeUndefined();
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.title).toEqual(title);
  expect(updatedteam.members[0]).toEqual(profile._id);

  const updatedProfile = await Profile.find();

  expect(updatedProfile[0].joinedTeams[0]).toEqual(updatedteam._id);
});

it("returns 401 after unauthorized user tried to join a team", async () => {
  await createProfile(userId, userName, profileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const token = await login(userId);
  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();
  const team = teams[0];

  expect(team.title).toEqual(title);
  expect(team.members[0]).toBeUndefined();
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .send({ title: title })
    .expect(401);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.title).toEqual(title);
  expect(updatedteam.members[0]).toBeUndefined();

  const updatedProfile = await Profile.find();

  expect(updatedProfile[0].joinedTeams[0]).toBeUndefined();
});

it("returns 400 after user tries to join unexisting team", async () => {
  await createProfile(userId, userName, profileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const token = await login(userId);
  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();
  const team = teams[0];

  expect(team.title).toEqual(title);
  expect(team.members[0]).toBeUndefined();
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .post(`/api/v1/teams/${mongoose.Types.ObjectId().toHexString()}/join`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(400);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.title).toEqual(title);
  expect(updatedteam.members[0]).toBeUndefined();

  const updatedProfile = await Profile.find();

  expect(updatedProfile[0].joinedTeams[0]).toBeUndefined();
});

it("returns 400 after user tries to join a team twice", async () => {
  await createProfile(userId, userName, profileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const token = await login(userId);
  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();
  const team = teams[0];

  expect(team.title).toEqual(title);
  expect(team.members[0]).toBeUndefined();
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.title).toEqual(title);
  expect(updatedteam.members[0]).toEqual(profile._id);

  const updatedProfile = await Profile.find();

  expect(updatedProfile[0].joinedTeams[0]).toEqual(updatedteam._id);

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(400);

  const rejoinedTeams = await Team.find();
  const rejoinedteam = rejoinedTeams[0];

  expect(rejoinedteam.title).toEqual(title);
  expect(rejoinedteam.members[0]).toEqual(profile._id);
  expect(rejoinedteam.members[1]).toBeUndefined();

  const rejoinedProfile = await Profile.find();

  expect(rejoinedProfile[0].joinedTeams[0]).toEqual(rejoinedteam._id);
  expect(rejoinedProfile[0].joinedTeams[1]).toBeUndefined();
});
