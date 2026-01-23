# syntax=docker/dockerfile:1.4

##############################
#        BUILD STAGE
##############################
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


##############################
#     PRODUCTION STAGE
##############################
FROM node:24-slim AS prod

RUN npm install -g pm2

WORKDIR /usr/src/app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /usr/src/app/dist ./dist

# Runtime port (you can override with -p or env)
ARG PORT
ENV PORT=$PORT

EXPOSE $PORT

CMD ["pm2-runtime", "./dist/server.js", "--name", "shoppy-apps-backend"]
