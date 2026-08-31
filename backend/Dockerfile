# ============================================================================
# 🐳 APEX UNIVERSITY ERP — BACKEND DOCKERFILE
# ============================================================================
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
