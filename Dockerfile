# Use Node.js 23 to build and serve
FROM node:23

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . .
RUN npm run build

# Install a simple static file server globally
RUN npm install -g serve

# Expose port used by serve
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]
