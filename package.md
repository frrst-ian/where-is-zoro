{
  "name": "backend-api-template",
  "version": "1.0.0",
  "description": "RESTful API backend template",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": ["express", "api", "backend", "prisma", "jwt"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^6.14.0",
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prisma": "^6.14.0"
  }
}