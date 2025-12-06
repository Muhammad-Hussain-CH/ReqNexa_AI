# Backend container
FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci

# Copy source
COPY backend ./backend
WORKDIR /app/backend

# Build
RUN npm run build

# Run
EXPOSE 4000
CMD ["node", "dist/index.js"]

