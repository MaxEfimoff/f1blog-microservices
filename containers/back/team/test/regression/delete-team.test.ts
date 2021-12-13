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

it("returns 200 after tast call", async () => {
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
    .delete(`/api/v1/teams/${teams[0]._id}`)
    .set("Authorization", token)
    .send({ title: title })
    .expect(201);

  const teamsAfterDeleting = await Team.find();

  expect(teamsAfterDeleting[0]).toBeUndefined();
});
