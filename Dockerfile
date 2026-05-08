# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy root package.json for dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variable for build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Default nginx config is usually sufficient for simple SPAs
# But we could add a custom one if routing needs it (e.g. try_files)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
