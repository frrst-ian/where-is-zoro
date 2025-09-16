const request = require("supertest");
const app = require("../app");
const prisma = require("../models/prisma");

describe("Sessions API", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    // Create test photo that the sessions controller expects
    await prisma.photo.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "test-photo",
        photoUrl: "http://example.com/test.jpg",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.gameSession.deleteMany({});
    await prisma.photo.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up sessions before each test
    await prisma.gameSession.deleteMany({});
  });

  // POST /sessions
  it("should create new session with valid sessionId", async () => {
    const response = await request(app).post("/sessions").expect(201);

    expect(response.body.sessionId).toBeDefined();
    expect(response.body.startTime).toBeDefined();
  });

  // GET /sessions/:sessionId
  it("should get existing session", async () => {
    const createRes = await request(app).post("/sessions").expect(201);

    const sessionId = createRes.body.sessionId;

    const response = await request(app)
      .get(`/sessions/${sessionId}`)
      .expect(200);

    expect(response.body.sessionId).toBe(sessionId);
  });

  it("should return 404 for non-existent session", async () => {
    await request(app).get("/sessions/fake-uuid").expect(404);
  });

  // PUT /sessions/:sessionId/complete
  it("should complete session successfully", async () => {
    const createRes = await request(app).post("/sessions").expect(201);

    await request(app)
      .put(`/sessions/${createRes.body.sessionId}/complete`)
      .expect(200);
  });
});
