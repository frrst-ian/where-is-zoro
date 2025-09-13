# Backend API Template

## Setup

```bash
npm install
```

Create `.env`:
```
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET=your-secret-key
```

Initialize Prisma:
```bash
npx prisma init --datasource-provider postgresql
npx prisma migrate dev
npx prisma generate
```

Start:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Development
- `npm start` - Production
- `npx prisma migrate dev` - Run migrations
- `npx prisma generate` - Generate client