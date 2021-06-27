import request from "supertest";
import { app } from "../../app";
import { login } from "./helpers/login";
import { pool } from "../../pool";

// it('returns 200 if user is logged in', async () => {
//   const token = await login();

//   await request(app)
//     .get('/api/v1/users/all')
//     .set('Authorization', token)
//     .send()
//     .expect(200);
// });

it("returns 200 if user is registered successfully", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "emv4@ya.ru",
      password: "123456",
      password2: "123456",
      name: "Max",
    })
    .expect(200);
});

it("returns 200 if user is logged in successfully", async () => {
  await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "emv3@ya.ru",
      password: "123456",
    })
    .expect(200);
});

it("returns 200 on getting users array", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/users/all")
    .set("Authorization", token)
    .send()
    .expect(200);
});

it("returns 401 if user is not logged in", async () => {
  await request(app).get("/api/v1/users/all").expect(401);
});

it("returns 401 if user is not logged in", async () => {
  const token = await login();

  await request(app)
    .get("/api/v1/users/current")
    .set("Authorization", token)
    .send()
    .expect(401);
});
