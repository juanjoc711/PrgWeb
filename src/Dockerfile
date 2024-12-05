# Use the official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for nodemon)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]
