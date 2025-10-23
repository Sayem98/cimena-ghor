import request from "supertest";
import { app } from "../../../app";

it("should register a new user successfully", async () => {
  const res = await request(app).post("/api/v1/auth/register").send({
    username: "testuser",
    email: "test@gmail.com",
    password: "Test@1234",
  });

  expect(res.status).toBe(201);
});
