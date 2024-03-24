# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json) to the working directory
COPY package.json yarn.lock* ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the React app
CMD [ "npm","run","dev"]
