# Stage 1 - Builder
# This stage has everything needed to compile TypeScript - including dev dependencies
# Think of this as the scaffolding, it does its job then gets thrown away
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first and install ALL dependencies (including dev like typescript)
# We do this before copying source code so Docker can cache this layer
# If your code changes but package.json doesn't, Docker skips this step on rebuild
COPY package*.json ./
RUN npm ci

# Copy config and source files then compile TypeScript to JavaScript
# Output lands in /app/dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2 - Production
# Fresh start - this is the actual image that gets deployed
# It only receives the compiled JavaScript from stage 1, not the TypeScript compiler
FROM node:20-alpine AS production

WORKDIR /app

# Only install production dependencies this time
# No typescript, no jest, no nodemon - nothing that isn't needed to run the app
COPY package*.json ./
RUN npm ci --only=production

# Pull the compiled JavaScript from stage 1 - this is the only thing we need from there
COPY --from=builder /app/dist ./dist

# Documents that the app listens on 3000 - Cloud Run will override this at runtime
EXPOSE 3000

# This is what runs when the container starts - plain Node running compiled JavaScript
CMD ["node", "dist/index.js"]