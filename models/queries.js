const prisma = require("./prisma");

async function getUserById(id) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

async function getUserByEmail(email) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
}

async function getUserByEmailOrUsername(identifier) {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        }
    })
}

module.exports = { getUserById, getUserByEmail, getUserByEmailOrUsername };