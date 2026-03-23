# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm install --omit=dev
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
EXPOSE 3000
# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
