# First stage: Build the project
FROM node:16-alpine as build

# Install build dependencies
RUN apk update && \
  apk add --no-cache make gcc g++ curl py-pip git

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy all project files
COPY . .

# Build the TypeScript project
RUN yarn build

# Second stage: Prepare production environment
FROM node:16-alpine

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3333

# Install tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Create application directories
RUN mkdir -p /app && chown -R node:node /app

# Copy built files and dependencies from the build stage
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Copy the GraphQL schema file
COPY ./src/graphql/schema.gql /app/dist/graphql/schema.gql

# Set working directory and user
WORKDIR /app
USER node

# Expose the port and start the application
EXPOSE 3333
CMD ["node", "dist/main.js"]
