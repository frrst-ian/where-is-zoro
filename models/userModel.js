const prisma = require("./prisma");

async function createUser(email, username, password) {
    return await prisma.user.create({
        data: {
            email: email,
            username: username,
            password: password,
        },
    });
}

module.exports = { createUser };
