FROM node:12.3.1

# Add package file
COPY package*.json ./
# Install deps
RUN yarn

# Copy source
COPY . .

# Build dist
RUN yarn build

# Expose port 3000
EXPOSE 3000

CMD yarn start
