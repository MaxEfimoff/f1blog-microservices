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

it("returns 201 after user leaves a team", async () => {
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
    .post(`/api/v1/teams/${team._id}/leave`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const leavedTeams = await Team.find();
  const leavedteam = leavedTeams[0];

  expect(leavedteam.title).toEqual(title);
  expect(leavedteam.members[0]).toBeUndefined();

  const leavedProfile = await Profile.find();

  expect(leavedProfile[0].joinedTeams[0]).toBeUndefined();
});

it("returns 401 after unauthorized user tries to leave a team", async () => {
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
    .post(`/api/v1/teams/${team._id}/leave`)
    .send({ title: title })
    .expect(401);

  const leavedTeams = await Team.find();
  const leavedteam = leavedTeams[0];

  expect(leavedteam.title).toEqual(title);
  expect(leavedteam.members[0]).toEqual(profile._id);

  const leavedProfile = await Profile.find();

  expect(leavedProfile[0].joinedTeams[0]).toEqual(updatedteam._id);
});

it("returns 400 after user tries to leave unexisting team", async () => {
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
    .post(`/api/v1/teams/${mongoose.Types.ObjectId().toHexString()}/leave`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(400);

  const leavedTeams = await Team.find();
  const leavedteam = leavedTeams[0];

  expect(leavedteam.title).toEqual(title);
  expect(leavedteam.members[0]).toEqual(profile._id);

  const leavedProfile = await Profile.find();

  expect(leavedProfile[0].joinedTeams[0]).toEqual(updatedteam._id);
});

it("returns 400 after user tries to leave a team twice", async () => {
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
    .post(`/api/v1/teams/${team._id}/leave`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const leavedTeams = await Team.find();
  const leavedteam = leavedTeams[0];

  expect(leavedteam.title).toEqual(title);
  expect(leavedteam.members[0]).toBeUndefined();

  const leavedProfile = await Profile.find();

  expect(leavedProfile[0].joinedTeams[0]).toBeUndefined();

  await request(app)
    .post(`/api/v1/teams/${team._id}/leave`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(400);
});
