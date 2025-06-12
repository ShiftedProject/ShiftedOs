# Use an official Node.js runtime as the base image.
# 'slim' means it's a smaller, more secure version.
FROM node:18-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# This is a clever trick that uses Docker's caching. If you don't change
# your dependencies, this step won't re-run, making future builds much faster.
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Now, copy the rest of your application's source code (e.g., index.js)
COPY . .

# Tell Docker that the container will listen on port 8080 at runtime.
# This is the port Cloud Run will send traffic to.
EXPOSE 8080

# Define the command to run your application when the container starts.
CMD [ "npm", "start" ]