# Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=lts

# Base Image
FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory.
COPY package.json package-lock.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG DB_NAME
ENV DB_NAME=${DB_NAME}

ARG EMAIL_CREDENTIALS
ENV EMAIL_CREDENTIALS=${EMAIL_CREDENTIALS}

# Build the application.
RUN npm run build

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run start
