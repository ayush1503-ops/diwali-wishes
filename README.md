# DiwaliWish — Personalized Diwali Wishes & Fun Predictions

A full-stack MERN web application where users enter their name and birthdate to receive a personalized Diwali greeting, fun prediction, lucky color, lucky number, and downloadable greeting card.

## Architecture

```
React Frontend (Vite) → HTTPS/JSON API → Express + Node.js Backend → Mongoose → MongoDB Atlas
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router DOM |
| State | React Context (Auth) + local state |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Card Download | html2canvas |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) + @supabase/supabase-js |
| Auth | Supabase Auth + JWT |
| Security | Helmet, CORS, express-rate-limit |

## Project Structure

```
diwali-wish-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, WishForm, WishCard, Fireworks, DiyaAnimation, ThemeSelector, ProtectedRoute
│   │   ├── pages/          # Home, CreateWish, GreetingCard, MyWishes, Login, Register, AdminDashboard
│   │   ├── context/        # AuthContext
│   │   ├── services/       # API service layer
│   │   └── styles/         # Design tokens (copied from design system)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── config/             # Database connection
│   ├── models/             # User, Wish, WishTemplate, Prediction (Mongoose)
│   ├── routes/             # authRoutes, wishRoutes, adminRoutes
│   ├── controllers/        # authController, wishController, adminController
│   ├── middleware/         # authMiddleware, adminMiddleware
│   ├── utils/              # zodiac, prediction, generateSlug
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── opendesign/              # Design system + mockups (OpenDesign)
│   ├── index.html          # Viewer
│   ├── manifest.json       # File index
│   ├── design-systems/
│   │   └── diwaliwish/     # Tokens, brand, assets, UI kit
│   └── mockups/
│       └── diwaliwish-screens/  # 4 high-fi HTML mockups
│
├── package.json            # Root workspace + dev scripts
├── .gitignore
└── README.md
```

## Database Tables (Supabase PostgreSQL)

Run `server/supabase_schema.sql` in your Supabase SQL Editor.

- **profiles**: id, name, email, role, is_active, created_at, updated_at
- **wishes**: id, user_id, recipient_name, birthdate, zodiac_sign, theme, prediction, wish_message, lucky_color, lucky_number, lucky_flower, personality_trait, share_slug, is_public, views, shares, downloads, created_at, updated_at
- **wish_templates**: id, category, message, language, is_active, created_by, created_at, updated_at
- **predictions**: id, zodiac_sign, message, is_active, created_at, updated_at
- **analytics**: id, wish_id, action, ip_address, created_at

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Password reset |
| POST | `/api/wishes/generate` | Generate personalized wish |
| GET | `/api/wishes/public/:slug` | View public wish |
| GET | `/api/wishes/my` | Get user's wishes |
| PATCH | `/api/wishes/:id` | Update wish |
| DELETE | `/api/wishes/:id` | Delete wish |
| POST | `/api/wishes/:id/share` | Increment share count |
| POST | `/api/wishes/:id/download` | Increment download count |
| GET | `/api/admin/templates` | View templates |
| POST | `/api/admin/templates` | Create template |
| PATCH | `/api/admin/templates/:id` | Update template |
| GET | `/api/admin/analytics` | App analytics |
| GET | `/api/admin/users` | View users |
| PATCH | `/api/admin/users/:id/block` | Block/activate user |

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy `server/.env` and add your Supabase project credentials:

```env
PORT=5000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Get these from your Supabase project: **Settings → API**

### 3. Set up the database

Run `server/supabase_schema.sql` in your Supabase SQL Editor to create all tables (profiles, wishes, wish_templates, predictions, analytics) with Row Level Security policies.

Then create an admin user via **Supabase Authentication → Add User**, and insert their profile:

```sql
insert into profiles (id, name, email, role)
values ('<auth-user-id>', 'Admin', 'admin@diwaliwish.com', 'admin');
```

### 3b. Seed the database (optional)

```bash
npm run seed --prefix server
```

Creates wish templates and predictions.

### 4. Run development servers

```bash
# Run both client and server concurrently
npm run dev

# Or individually
npm run client    # Vite dev server (http://localhost:5173)
npm run server    # Express server (http://localhost:5000)
```

### 5. Build for production

```bash
npm run build     # Builds React frontend to client/dist/
```

## Design System

The premium DiwaliWish design system lives under `./opendesign/design-systems/diwaliwish/`:

- **Tokens:** `tokens/colors_and_type.css` — midnight purple, maroon, gold/amber/saffron accents
- **Typography:** Cormorant (headings) + Montserrat (body)
- **Motion:** Diya flicker, card flip, floating particles, scroll reveals
- **UI Kit:** Button, Card, Input, DiyaAnimation, WishCard, ThemeSelector components

View mockups and the interactive UI kit at: http://localhost:8289/opendesign/

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@diwaliwish.com | Admin123! |
| User | demo@diwaliwish.com | Demo123! |

## MVP Features

- ✅ Diwali-themed landing page with diya animation
- ✅ Name and birthdate form with validation
- ✅ Zodiac sign calculation
- ✅ Lucky color, number, flower, personality trait
- ✅ Fun prediction based on zodiac
- ✅ Five themes: Royal Gold, Traditional Diya, Modern Neon, Rangoli, Fireworks
- ✅ Animated greeting card with flip interaction
- ✅ Download and share (counter tracking)
- ✅ User registration/login with JWT
- ✅ My Wishes dashboard (save, edit, delete)
- ✅ Admin panel (templates, users, analytics)
- ✅ Responsive design (mobile, tablet, desktop)

## Future Enhancements

- AI-generated wishes (LLM API)
- Voice greeting (text-to-speech)
- Video greeting cards
- Multi-language support (Hindi, Marathi, Tamil, Telugu, Bengali)
- QR codes for wishes
- Group Diwali wish wall
- Scheduled wish delivery
- Premium themes and custom name art
