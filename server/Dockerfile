# Use Node.js LTS
FROM node:22-slim

# Install FFmpeg, Python, and dependencies required by yt-dlp
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --break-system-packages yt-dlp

# Create app directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Railway uses PORT environment variable
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "src/server.js"]
