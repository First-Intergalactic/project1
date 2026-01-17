# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

1. **Always run `npm run dev:server` in background** when testing API changes
2. **Check Prisma schema** before modifying database-related code
3. **Use existing CSS variables** from `client/src/styles/index.css` for styling
4. **JWT auth required** for all `/api/users/*`, `/api/matches/*`, `/api/discovery/*` endpoints
5. **Socket.IO events** must be handled in both `server/src/index.js` and `client/src/context/SocketContext.jsx`

## Quick Commands for Claude

When working on this project, use these shortcuts:
- `npm run dev` - Start both client and server
- `npm run dev:client` - Start only frontend (port 5173)
- `npm run dev:server` - Start only backend (port 3001)

## Common Tasks

### Add new API endpoint
1. Create/edit file in `server/src/routes/`
2. Add route to `server/src/index.js`
3. Add API method to `client/src/services/api.js`

### Add new page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add CSS in `client/src/pages/` (same name .css)

### Modify database
1. Edit `server/prisma/schema.prisma`
2. Run `cd server && npx prisma migrate dev --name description`
3. Update seed.js if needed

## Project Overview

LoveMatch - dating web application (Tinder-like) with React frontend and Node.js backend.

## Tech Stack

- **Frontend**: React 18 + Vite + React Router + Framer Motion
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT tokens
- **Real-time**: Socket.IO for chat

## Project Structure

```
website/
├── client/                 # React frontend (port 5173)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, SocketContext
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API client
│   │   └── styles/         # CSS with gradient theme
├── server/                 # Express backend (port 3001)
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # JWT auth
│   │   └── index.js        # Server + Socket.IO setup
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.js         # Demo data
```

## Commands

```bash
# Install all dependencies
npm install && cd client && npm install && cd ../server && npm install && cd ..

# Database setup (requires PostgreSQL)
cd server && npx prisma migrate dev --name init && cd ..

# Seed demo data
cd server && npm run db:seed && cd ..

# Run development (client + server)
npm run dev

# Run only client
npm run dev:client

# Run only server
npm run dev:server
```

## Key Features

- Swipe cards with react-tinder-card
- Real-time chat with Socket.IO + typing indicators
- Profile verification system
- Compatibility percentage based on interests
- Geolocation-based discovery
- Block/report users
- Ice breakers for conversation starters
- Favorites and profile views

## API Endpoints

### Auth
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Current user

### Users
- GET/PUT `/api/users/profile` - Profile
- POST `/api/users/photos` - Upload photo
- POST `/api/users/verify` - Verify profile
- PUT `/api/users/preferences` - Update preferences
- PUT `/api/users/location` - Update location
- GET `/api/users/views` - Who viewed profile
- GET `/api/users/favorites` - Favorites list
- POST `/api/users/block/:id` - Block user
- POST `/api/users/report/:id` - Report user

### Discovery
- GET `/api/discovery/cards` - Get swipe cards
- GET `/api/discovery/nearby` - People nearby
- GET `/api/discovery/likes` - Who liked me
- GET `/api/discovery/icebreakers` - Ice breakers

### Matches
- GET `/api/matches` - All matches
- GET `/api/matches/:id/messages` - Chat messages
- POST `/api/matches/:id/messages` - Send message

## Database

Edit `server/.env` for PostgreSQL connection:
```
DATABASE_URL="postgresql://user:pass@localhost:5432/dating_app"
JWT_SECRET="your-secret-key"
```

## Demo Accounts

After seeding (password: `demo123`):
- anna@demo.com, maria@demo.com, elena@demo.com, olga@demo.com
- ivan@demo.com, dmitry@demo.com, alex@demo.com, sergey@demo.com

## Code Style

- **Language**: Russian for UI text, English for code/comments
- **Naming**: camelCase for variables/functions, PascalCase for components
- **CSS**: Use gradient variables from `client/src/index.css`
- **API errors**: Return JSON `{ error: 'message' }`

## Troubleshooting

### Database connection error
- Check PostgreSQL is running: `brew services list`
- Verify DATABASE_URL in `server/.env`

### Port already in use
- Kill process: `lsof -ti:3001 | xargs kill -9`

### Prisma client outdated
- Regenerate: `cd server && npx prisma generate`

## File Locations

| Feature | Frontend | Backend |
|---------|----------|---------|
| Auth | `client/src/context/AuthContext.jsx` | `server/src/routes/auth.js` |
| Swipes | `client/src/pages/Discover.jsx` | `server/src/routes/swipes.js` |
| Chat | `client/src/pages/Chat.jsx` | `server/src/routes/matches.js` |
| Profile | `client/src/pages/Profile.jsx` | `server/src/routes/users.js` |
| Discovery | `client/src/pages/Discover.jsx` | `server/src/routes/discovery.js` |

## Validation Checklist

Before committing changes, verify:
- [ ] Server starts without errors: `npm run dev:server`
- [ ] Client builds: `cd client && npm run build`
- [ ] Prisma schema valid: `cd server && npx prisma validate`
- [ ] No console errors in browser

## Common Patterns

### API Request with Auth
```javascript
// client/src/services/api.js pattern
const response = await fetch(`${API_URL}/endpoint`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Protected Route Handler
```javascript
// server/src/routes/*.js pattern
router.get('/endpoint', authMiddleware, async (req, res) => {
  const userId = req.user.id; // from JWT
  // ... logic
});
```

### Socket.IO Event
```javascript
// Server: emit to specific user
io.to(`user_${userId}`).emit('eventName', data);

// Client: listen for event
socket.on('eventName', (data) => { /* handle */ });
```

## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Prisma client not found" | Run `cd server && npx prisma generate` |
| CORS errors | Check server is running on port 3001 |
| Socket not connecting | Verify `VITE_API_URL` in client |
| Auth token expired | Clear localStorage, re-login |

## Environment Variables

### Server (`server/.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/dating_app
JWT_SECRET=your-secret-key
PORT=3001
```

### Client (optional `client/.env`)
```
VITE_API_URL=http://localhost:3001
```
