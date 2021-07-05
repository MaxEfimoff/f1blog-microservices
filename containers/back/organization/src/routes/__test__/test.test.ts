import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";

const userId = 1;

it("returns 200 after tast call", async () => {
  const token = await login(userId);

  await request(app)
    .get("/api/v1/organization/test")
    .set("Authorization", token)
    .send()
    .expect(200);
});

it("returns 401 if user is not logged in", async () => {
  await request(app).get("/api/v1/organization/test").expect(401);
});
