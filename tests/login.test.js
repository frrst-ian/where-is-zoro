const request = require("supertest");
const app = require("../app");
const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");

describe("POST /auth/login", () => {
    beforeAll(async () => {
        process.env.NODE_ENV = "test";
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany({});
    });

    it("should login with email and return JWT token", async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await prisma.user.create({
            data: {
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
            },
        });

        const loginData = {
            identifier: "test@example.com",
            password: "Password123",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(200);

        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe("test@example.com");
        expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it("should login with username and return JWT token", async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await prisma.user.create({
            data: {
                email: "test2@example.com",
                username: "testuser123",
                password: hashedPassword,
            },
        });

        const loginData = {
            identifier: "testuser123",
            password: "Password123",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(200);

        expect(response.body.token).toBeDefined();
        expect(response.body.user.username).toBe("testuser123");
        expect(response.body.user.password).toBeUndefined();
    });

    it("should return validation errors for missing fields", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({})
            .expect(400);

        expect(response.body.error).toBe("Validation failed");
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: "identifier" }),
                expect.objectContaining({ path: "password" }),
            ]),
        );
    });

    it("should return error for non-existent user", async () => {
        const loginData = {
            identifier: "nonexistent@example.com",
            password: "Password123",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(401);

        expect(response.body.error).toBe("Invalid credentials");
    });

    it("should return error for incorrect password", async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await prisma.user.create({
            data: {
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
            },
        });

        const loginData = {
            identifier: "test@example.com",
            password: "WrongPassword",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(401);

        expect(response.body.error).toBe("Invalid credentials");
    });

    it("should handle empty identifier field", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                identifier: "",
                password: "Password123",
            })
            .expect(400);

        expect(response.body.error).toBe("Validation failed");
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: "identifier",
                    msg: expect.stringContaining("required"),
                }),
            ]),
        );
    });

    it("should handle empty password field", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                identifier: "test@example.com",
                password: "",
            })
            .expect(400);

        expect(response.body.error).toBe("Validation failed");
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: "password",
                    msg: expect.stringContaining("required"),
                }),
            ]),
        );
    });

    it("should be case-insensitive for email login", async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash("Password123", 10);
        await prisma.user.create({
            data: {
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
            },
        });

        const loginData = {
            identifier: "TEST@EXAMPLE.COM",
            password: "Password123",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(200);

        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe("test@example.com");
    });

    it("should return user data without sensitive fields", async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash("Password123", 10);
        const user = await prisma.user.create({
            data: {
                email: "test@example.com",
                username: "testuser",
                password: hashedPassword,
            },
        });

        const loginData = {
            identifier: "test@example.com",
            password: "Password123",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(loginData)
            .expect(200);

        // Check that user data is returned without sensitive fields
        expect(response.body.user).toEqual({
            id: user.id,
            email: "test@example.com",
            username: "testuser",
        });
        expect(response.body.user.password).toBeUndefined();
        expect(response.body.user.createdAt).toBeUndefined();
        expect(response.body.user.updatedAt).toBeUndefined();
    });

    it("should handle SQL injection attempts", async () => {
        const maliciousData = {
            identifier: "'; DROP TABLE users; --",
            password: "password",
        };

        const response = await request(app)
            .post("/auth/login")
            .send(maliciousData)
            .expect(401);

        expect(response.body.error).toBe("Invalid credentials");
    });
});
