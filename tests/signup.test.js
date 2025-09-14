const request = require("supertest");
const app = require("../app");
const prisma = require("../models/prisma");

describe("POST /auth/signup", () => {
    beforeAll(async () => {
        process.env.NODE_ENV = "test";
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany({});
    });

    it("should create user with email and return JWT token", async () => {
        const userData = {
            email: "test@example.com",
            username: "testuser",
            password: "Password123",
            confirmPassword: "Password123",
        };

        const response = await request(app)
            .post("/auth/signup")
            .send(userData)
            .expect(201);

        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe("test@example.com");

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { email: "test@example.com" },
        });
        expect(user).toBeTruthy();
        expect(user.password).not.toBe("Password123"); // Should be hashed
    });

    it("should create user with username and return JWT token", async () => {
        const userData = {
            email: "test2@example.com",
            username: "testuser123",
            password: "Password123",
            confirmPassword: "Password123",
        };

        const response = await request(app)
            .post("/auth/signup")
            .send(userData)
            .expect(201);

        expect(response.body.token).toBeDefined();
        expect(response.body.user.username).toBe("testuser123");
    });

    it("should return validation errors for missing fields", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .send({})
            .expect(400);

        expect(response.body.error).toBe("Validation failed");
        expect(response.body.details).toHaveLength(8);
    });

    it("should return error for password mismatch", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .send({
                identifier: "test@example.com",
                password: "Password123",
                confirmPassword: "DifferentPassword",
            })
            .expect(400);

        expect(
            response.body.details.some((d) => d.msg.includes("do not match")),
        ).toBeTruthy();
    });

    it("should handle duplicate email error", async () => {
        // Create first user
        await prisma.user.create({
            data: {
                email: "existing@example.com",
                password: "hashedpassword",
                username: "existingUser",
            },
        });

        const response = await request(app)
            .post("/auth/signup")
            .send({
                identifier: "existing@example.com",
                password: "Password123",
                confirmPassword: "Password123",
            })
            .expect(400); 

        expect(response.body.error).toBe('Validation failed');
    });
});
