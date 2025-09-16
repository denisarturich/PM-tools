# PM Tools - Project Manager Prompts Reference

English-language Project Manager Prompts Reference web application with searchable database, copy functionality, admin panel, and author attribution.

## Features

- 🔍 Searchable database of project management prompts
- 📋 Copy functionality for easy prompt usage  
- 🗂️ Organized by project stages (Initiation, Planning, Execution, Monitoring, Closing)
- 👥 Author attribution and links
- 🎨 Modern responsive design with dark/light mode
- 📱 Mobile-friendly interface

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Local Setup

1. Install dependencies:
```bash
npm ci
```

2. Set up database:
```bash
npx prisma generate
npx prisma migrate deploy
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm run start
```

## Deploy (PM2)

For production deployment using PM2 on VPS:

### Prerequisites

- PM2 installed globally: `npm install -g pm2`
- PostgreSQL database configured
- Environment variables set

### Deployment Steps

1. Clone and install dependencies:
```bash
git clone <repository-url>
cd pm-tools
npm ci
```

2. Set up database:
```bash
npx prisma generate
npx prisma migrate deploy
```

3. Build the application:
```bash
npm run build
```

4. Start with PM2:
```bash
pm2 start ecosystem.config.cjs --env production
```

5. Save PM2 configuration:
```bash
pm2 save
pm2 startup
```

### PM2 Management Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs pm-tools

# Restart
pm2 restart pm-tools

# Stop
pm2 stop pm-tools

# Delete
pm2 delete pm-tools
```

## Environment Variables

Create `.env` file with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/pmtools
SESSION_SECRET=your-session-secret
NODE_ENV=production
PORT=3000
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Build**: Vite (frontend), esbuild (backend)
- **Deployment**: PM2, Replit

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared schemas and types
├── prisma/          # Database schema and migrations
├── dist/            # Built application (generated)
└── ecosystem.config.cjs  # PM2 configuration
```

## License

MIT