# ReqNexa AI

ReqNexa AI is an intelligent requirement-gathering chatbot system for software development. It automates collecting, structuring, and refining software requirements using AI.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Databases: PostgreSQL (core data), MongoDB (chat logs)
- AI: Anthropic Claude API
- Auth: JWT + bcrypt
- Deployment: Docker containers

## Project Structure

```
reqnexa-ai/
├── frontend/          React app
├── backend/           Node.js API
├── shared/            Shared types
├── docker/            Docker configs
├── docs/              Documentation
├── .github/           CI/CD
└── README.md          This file
```

## Getting Started

- Install Node.js LTS and Docker
- Copy `.env.example` files to `.env` in root, `frontend`, and `backend`
- Run `npm install` in `frontend` and `backend`
- Start backend dev server: `npm run dev` (in `backend`)
- Start frontend dev server: `npm run dev` (in `frontend`)

