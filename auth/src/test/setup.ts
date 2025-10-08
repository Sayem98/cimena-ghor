/// <reference types="jest" />
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "node:path";
// import { app } from "../app";

let mongoServer: MongoMemoryServer | null = null;

jest.setTimeout(180_000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    // Cache the binary so next runs are fast & offline-friendly
    binary: {
      version: "7.0.14",
      downloadDir: path.resolve(".cache/mongodb-binaries"),
    },
    instance: { dbName: "testdb" },
  });
  await mongoose.connect(mongoServer.getUri(), { dbName: "testdb" });
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not established.");
  }
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Close Mongoose first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  // Guard in case beforeAll failed
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
});
