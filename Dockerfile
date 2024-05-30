# Use a node image as the base
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml if using pnpm)
COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of your application code
COPY . .

# Build the application
RUN pnpm run build

# Use a lighter weight image for production
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

RUN npm install -g pnpm

# Install production dependencies
RUN pnpm install --prod

# Start the application
CMD ["node", "dist/index.js"]