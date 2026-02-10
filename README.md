# PM Tools - Project Manager Prompts Reference

English-language Project Manager Prompts Reference web application with searchable database, copy functionality, admin panel, and author attribution.

## Features

- 🔍 Searchable database of project management prompts
- 📋 Copy functionality for easy prompt usage  
- 🗂️ Organized by project stages (Initiation, Planning, Execution, Monitoring, Closing)
- 👥 Author attribution and links
- 🎨 Modern responsive design with dark/light mode
- 📱 Mobile-friendly interface
- 🤖 **AI-Powered Risk Management Assistant**
  - Generate realistic risks from project descriptions
  - Analyze existing risks with actionable insights
  - Suggest mitigation strategies with concrete action plans
  - Free-form chat for risk management questions
  - Toggle AI features on/off in settings

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

## AI Features

### Setup

The application includes an AI-powered Risk Assistant using Claude API (Anthropic).

1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
   ANTHROPIC_MODEL=claude-sonnet-4-20250514
   ANTHROPIC_MAX_TOKENS=2000
   AI_FEATURE_ENABLED=true
   ```
3. Test the connection:
   ```bash
   cd server
   npm run test:ai
   ```

### Features

- **Generate Risks**: AI analyzes project description and suggests realistic risks
- **Analyze Risks**: Reviews existing risks and provides insights
- **Suggest Mitigation**: Creates action plans to reduce risk impact
- **Free Chat**: Ask questions about risk management

### Disabling AI

To disable AI features:
- **User Level**: Toggle "AI Assistant" in settings (gear icon in header)
- **Server Level**: Set `AI_FEATURE_ENABLED=false` in `.env`
- **Development**: Set `VITE_USE_MOCK_AI=true` in `client/.env` to use mock data

### Cost Monitoring

Claude Sonnet 4 pricing:
- ~$3 per million input tokens
- ~$15 per million output tokens
- Average request: ~$0.01-0.02

Monitor usage in [Anthropic Console](https://console.anthropic.com/).

## Environment Variables

Create `.env` file in root directory with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pmtools

# Server
SESSION_SECRET=your-session-secret
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

# Anthropic AI (Optional)
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS=2000
AI_FEATURE_ENABLED=true
```

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_AI=false
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