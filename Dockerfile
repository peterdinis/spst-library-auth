FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build


# Build the image as production
# So we can minimize the size
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
ENV PORT=4000
ENV NODE_ENV=Production
RUN npm install
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}

CMD ["pnpm", "run", "start"]