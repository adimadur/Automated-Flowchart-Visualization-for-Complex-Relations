# Use an official Node.js image with Python and build tools
FROM node:20-bullseye

# Install Python3, pip, and Graphviz
RUN apt-get update && \
    apt-get install -y python3 python3-pip graphviz && \
    rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Python requirements and install Python dependencies
COPY python/ ./python/
RUN pip3 install --no-cache-dir -r python/requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port (default 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"] 