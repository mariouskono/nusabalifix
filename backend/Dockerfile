FROM python:3.11-slim

# Install Node.js dan tools build (npm, build-essential)
RUN apt-get update && apt-get install -y curl build-essential \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs

# Install Python dependencies
RUN pip install --no-cache-dir pandas tensorflow numpy

# Create symlinks for both python and python3 to ensure compatibility
RUN ln -sf $(which python3) /usr/local/bin/python || echo "python3 link failed"
RUN ln -sf $(which python3) /usr/bin/python || echo "python fallback link failed"

# Verify Python installation
RUN python --version && python3 --version

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies Node.js
RUN npm install

# Copy seluruh source code
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]