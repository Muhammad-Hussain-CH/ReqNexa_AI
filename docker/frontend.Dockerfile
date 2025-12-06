# Frontend container
FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci

# Copy source
COPY frontend ./frontend
WORKDIR /app/frontend

# Build
RUN npm run build

# Serve
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

