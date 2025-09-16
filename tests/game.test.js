const request = require("supertest");
const app = require("../app");
const prisma = require("../models/prisma");

describe("POST /game/validate-click", () => {
  let testCharId;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear tables
    await prisma.click.deleteMany({});
    await prisma.charactersOnPhotos.deleteMany({});
    await prisma.character.deleteMany({});
    await prisma.photo.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed photo
    const photo = await prisma.photo.create({
      data: {
        name: "Anime Shelf",
        photoUrl: "https://unsplash.com/photos/anime-character-collage-photo-on-black-wooden-shelf-IxDPZ-AHfoI"
      }
    });

    // Seed characters
    const char1 = await prisma.character.create({ data: { name: "Zoro" } });
    const char2 = await prisma.character.create({ data: { name: "Luffy" } });

    // Save first character ID for test clicks
    testCharId = char1.id;

    // Add characters to photo with coordinates
    await prisma.charactersOnPhotos.createMany({
      data: [
        { photoId: photo.id, characterId: char1.id, x: 1521, y: 289, radius: 50 },
        { photoId: photo.id, characterId: char2.id, x: 1559, y: 205, radius: 50 }
      ]
    });
  });

  it("should return success: true for a click at exact coordinates", async () => {
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: 1521, clickY: 289, characterId: testCharId })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.character.id).toBe(testCharId);
  });

  it("should return success: true for a click within the radius", async () => {
    // Click slightly off-center but still within radius of 50
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: 1521 + 30, clickY: 289 - 20, characterId: testCharId })
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("should return success: false for a click outside the radius", async () => {
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: 1600, clickY: 400, characterId: testCharId })
      .expect(200);

    expect(response.body.success).toBe(false);
  });

  it("should return 404 if character does not exist", async () => {
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: 1521, clickY: 289, characterId: 9999 })
      .expect(404);

    expect(response.body.error).toBe("Character not found");
  });

  it("should return 400 if coordinates or characterId are missing", async () => {
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: 100 })
      .expect(400);

    expect(response.body.error).toBe("Missing coordinates or character");
  });

  it("should return 400 if coordinates or characterId are invalid types", async () => {
    const response = await request(app)
      .post("/game/validate-click")
      .send({ clickX: "abc", clickY: "def", characterId: "xyz" })
      .expect(400);

    expect(response.body.error).toBe("Invalid data types");
  });
});
