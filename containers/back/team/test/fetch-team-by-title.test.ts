import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Team } from "../../db/models/Team";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";

it("returns 200 after fetching a team by title", async () => {
  await createProfile(userId, userName, profileHandle);

  const token = await login(userId);

  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();

  expect(teams[0].title).toEqual(title);
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  const res2 = await request(app)
    .get(`/api/v1/teams/title/${teams[0].title}`)
    .set("Authorization", token)
    .expect(200);

  expect(res2.body.data.team.title).toEqual(title);
});

it("returns 401 after fetching a team by id if unauthorized", async () => {
  await createProfile(userId, userName, profileHandle);

  const token = await login(userId);

  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  const res = await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teams = await Team.find();

  expect(teams[0].title).toEqual(title);
  expect(res.body.data.newTeam.title).toEqual(title);
  expect(res.body.data.newTeam.profile.handle).toEqual(profileHandle);

  await request(app).get(`/api/v1/teams/title/${teams[0].title}`).expect(401);
});

it("returns 400 after fetching a team by wrong title", async () => {
  await createProfile(userId, userName, profileHandle);

  const token = await login(userId);

  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

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
    .get(`/api/v1/teams/title/vdfgdgd`)
    .set("Authorization", token)
    .expect(400);
});
