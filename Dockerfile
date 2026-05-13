# Stage 1: Build Application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve Application with NGINX
FROM nginx:alpine AS production

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
