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
const secondUserId = 7;
const secondUserName = "newtestusername";
const secondProfileHandle = "newtestprofilehandle";

it("returns 200 fetches all users in a team", async () => {
  await createProfile(userId, userName, profileHandle);
  await createProfile(secondUserId, secondUserName, secondProfileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const profile2 = profiles[1];
  const token = await login(userId);
  const token2 = await login(secondUserId);
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

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .set("Authorization", token2)
    .send({ title: title })
    .expect(201);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.title).toEqual(title);
  expect(updatedteam.members[0]).toEqual(profile2._id);
  expect(updatedteam.members[1]).toEqual(profile._id);

  const res2 = await request(app)
    .get(`/api/v1/teams/${updatedteam._id}`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(200);

  expect(res2.body.data.team.members).toStrictEqual[
    (profile2._id, profile._id)
  ];
  expect(res2.body.data.team.members[0]).toBeDefined();
  expect(res2.body.data.team.members[1]).toBeDefined();

  const res3 = await request(app)
    .delete(`/api/v1/teams/${team._id}/user/${profile2._id}`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const deletionTeams = await Team.find();

  expect(deletionTeams[0].members[0]).toBeDefined();
  expect(deletionTeams[0].members[0]).toEqual(profile._id);
  expect(deletionTeams[0].members[1]).toBeUndefined();
});
