# Use Node.js LTS image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose dynamic application port (configured at runtime)
# EXPOSE <dynamic_port>

# Start the service
CMD ["node", "index.js"]