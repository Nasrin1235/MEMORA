import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "../script/dbConnection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  await dbConnection();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User API tests", () => {
  test("Should register a user", async () => {
    const response = await request(app).post("/api/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Test1234!",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    userId = response.body.user._id;
  });

  test("Should login successfully", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "Test1234!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });
  test("Should upload avatar", async () => {
    const response = await request(app)
      .post("/api/upload-image")
      .set("Cookie", [`token=${token}`])
      .attach("image", path.join(__dirname, "test-image.png"));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("imageUrl");
  });

  test("Should upload background image", async () => {
    const response = await request(app)
      .post("/api/upload-background")
      .set("Cookie", [`token=${token}`])
      .attach("image", path.join(__dirname, "test-image.png"));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("backgroundImage");
  });

  test("Should fail login with wrong password", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  test("Should get user profile", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Cookie", [`token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "test@example.com");
  });

  test("Should update user profile", async () => {
    const response = await request(app)
      .put("/api/update")
      .set("Cookie", [`token=${token}`])
      .send({
        username: "updatedUser",
        email: "updated@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty("username", "updatedUser");
    expect(response.body.user).toHaveProperty("email", "updated@example.com");
  });

  test("✅ Should delete user account", async () => {
    const response = await request(app)
      .delete("/api/delete-account")
      .set("Cookie", [`token=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Account deleted successfully");
  });

  test("Should fail to get profile after account deletion", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Cookie", [`token=${token}`]);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });
});
