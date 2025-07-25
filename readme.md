# Build development image

docker build --target development -t recipe-api:dev .

# Build production image

docker build --target production -t recipe-api:prod .

# Run development container

docker run -p 3000:3000 -v $(pwd):/app recipe-api:dev

# Run production container

docker run -p 3000:3000 recipe-api:prod

# Start development environment

docker-compose up recipe-api

# Start production environment

docker-compose up recipe-api-prod

# Run tests

docker-compose --profile test run recipe-api-test

# Build and start in background

docker-compose up -d recipe-api

# Stop all services

docker-compose down

# Rebuild and start

docker-compose up --build recipe-api
