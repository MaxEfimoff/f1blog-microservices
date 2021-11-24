import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { createProfile } from "./helpers/create-profile";
import { Team } from "../../db/models/Team";

const userId = 1;
const userName = "testusername";
const profileHandle = "testprofilehandle";
const title = "faketitle";

beforeAll(() => {
  createProfile(userId, userName, profileHandle);
});

it("returns 200 after creating a team", async () => {
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
});

it("returns 401 after creating a team while unauthorized", async () => {
  const token = await login(userId);

  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  await request(app).post("/api/v1/teams/").send({ title: title }).expect(401);
});

it("returns 400 after creating a team without a title", async () => {
  const token = await login(userId);

  const teamsNumber = await Team.find();

  expect(teamsNumber[0]).toBeUndefined();

  await request(app)
    .post("/api/v1/teams/")
    .set("Authorization", token)
    .send({ title: "" })
    .expect(400);
});
