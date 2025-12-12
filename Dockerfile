# Build stage
FROM node:25-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve stage
FROM caddy:2.10.2-alpine

# Copy build artifacts to Caddy's default web root
COPY --from=build /app/dist /usr/share/caddy

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port 80
EXPOSE 80

# Start Caddy with config
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
