# ReqNexa AI

## Backend Setup
- Copy `backend/.env.example` to `backend/.env` and set:
  - `PORT=4000`
  - `CORS_ORIGIN=http://localhost:5173,http://localhost:5174`
  - `JWT_SECRET` and `JWT_REFRESH_SECRET` to long random strings
  - `GEMINI_API_KEY` to your Google Generative AI key
  - `DATABASE_URL` to your Neon Postgres URL
  - `MONGODB_URI` to your MongoDB Atlas connection string
- Install deps: `npm install`
- Start server: `npm run -w backend dev`

## Frontend Setup
- Create `frontend/.env` and set:
  - `VITE_API_URL=http://localhost:4000`
- Install deps: `npm install`
- Start app: `npm run -w frontend dev` (opens on `http://localhost:5173` or `5174`)

## AI Provider (Gemini)
- Uses `@google/generative-ai` via backend service.
- Keep `GEMINI_API_KEY` only in `backend/.env` (never in frontend).

## Databases
- Postgres: used for users, projects, requirements.
- MongoDB: used for generated documents and chat conversations.
- To apply schema (Postgres): `npm run -w backend db:schema`

## Testing
- Backend: `npm run -w backend test`
- Frontend: `npm run -w frontend test`
- Typecheck: `npm run -ws typecheck`

## Troubleshooting
- CORS errors: ensure `CORS_ORIGIN` includes your frontend URL and frontend points to `VITE_API_URL`.
- 401 Unauthorized: check `Authorization: Bearer <accessToken>` is set; login via app to obtain tokens.
- Gemini disabled: if `GEMINI_API_KEY` is empty, backend falls back to a stub; set the key to enable real responses.
- Postgres connection: verify `DATABASE_URL`; run `npm run -w backend db:schema` only on a dev database.
- MongoDB connection: verify `MONGODB_URI` and IP allowlist.

## Screenshots
- Place screenshots in `docs/screenshots/` and reference them here:
  - `docs/screenshots/login.png` – Login page
  - `docs/screenshots/dashboard.png` – Dashboard
  - `docs/screenshots/chat.png` – Chat with Gemini
  - `docs/screenshots/project-detail.png` – Project detail

