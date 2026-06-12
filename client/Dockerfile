# Stage 1: Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production stage with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# React Router support ke liye Nginx config (optional par secure)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]