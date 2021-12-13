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
const secondTitle = "faketibdfbtle";
const secondUserId = 7;
const secondUserName = "newtestusername";
const secondProfileHandle = "newtestprofilehandle";

it("returns 200 fetches my users in a team", async () => {
  await createProfile(userId, userName, profileHandle);
  await createProfile(secondUserId, secondUserName, secondProfileHandle);

  const profiles = await Profile.find();
  const profile = profiles[0];
  const profile2 = profiles[1];
  const token = await login(userId);
  const token2 = await login(secondUserId);
  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  // Create first team
  await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  // Create second team
  await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: secondTitle })
    .expect(201);

  const teams = await Team.find();
  const team = teams[0];
  const secondTeam = teams[1];

  expect(team.title).toEqual(title);
  expect(secondTeam.title).toEqual(secondTitle);

  await request(app)
    .post(`/api/v1/teams/${team._id}/join`)
    .set("Authorization", token2)
    .expect(201);

  const updatedTeams = await Team.find();
  const updatedteam = updatedTeams[0];

  expect(updatedteam.members[0]).toEqual(profile2._id);
  expect(updatedteam.profile).toEqual(profile._id);
  expect(updatedteam.members[1]).toBeUndefined();

  const res2 = await request(app)
    .get("/api/v1/teams/my")
    .set("Authorization", token2)
    .expect(200);

  const updatedProfile = await Profile.findById(profile2._id);

  expect(res2.body.data.myTeams[0]).toBeDefined();
  expect(res2.body.data.myTeams[1]).toBeUndefined();
});
