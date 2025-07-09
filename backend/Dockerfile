# Backend Dockerfile
FROM node:20-slim AS base

# Install Python for ML scripts
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Generate Prisma client for the correct platform
RUN npx prisma generate

# Create a virtual environment for Python and install dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r ml/requirements.txt

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "backend"]