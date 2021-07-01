import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";

it("returns 200 getting all profiles if logged in", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/profiles/all")
    .set("Authorization", token)
    .send()
    .expect(200);
});

it("returns 401 on getting all profiles if token is incorrect", async () => {
  const token = "fvdfvdfvd";

  await request(app)
    .get("/api/v1/profiles/all")
    .set("Authorization", token)
    .send()
    .expect(401);
});

it("returns 401 if user is not logged in", async () => {
  await request(app).get("/api/v1/profiles/all").expect(401);
});
