# Recipe API

A simple RESTful API for managing cooking recipes built with Node.js, TypeScript, and Express.

## Features

-   ✅ Create, read, update, and delete recipes
-   ✅ Search recipes by name or ingredients
-   ✅ Pagination and sorting support
-   ✅ TypeScript with full type safety
-   ✅ Comprehensive testing with Jest
-   ✅ Dockerized for easy deployment

## Quick Start

### Prerequisites

-   Node.js 18+
-   npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd skillsoft-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Create Recipe

```http
POST /recipes
Content-Type: application/json

{
  "name": "Pasta Carbonara",
  "ingredients": ["pasta", "eggs", "bacon", "cheese"],
  "instructions": "Cook pasta, mix with eggs and bacon",
  "prepTime": 20
}
```

### Get Recipe by ID

```http
GET /recipes/{id}
```

### Update Recipe

```http
PATCH /recipes/{id}
Content-Type: application/json

{
  "name": "Updated Recipe Name",
  "prepTime": 25
}
```

### Delete Recipe

```http
DELETE /recipes/{id}
```

### List Recipes

```http
GET /recipes?page=1&limit=10&search=pasta&sortBy=name&order=asc
```

**Query Parameters:**

-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)
-   `search` - Search in name/ingredients
-   `sortBy` - Sort by: name, prepTime, createdAt, updatedAt
-   `order` - asc or desc (default: desc)

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Docker

### Development

```bash
# Start with Docker Compose
docker-compose up recipe-api

# Or build and run manually
docker build --target development -t recipe-api:dev .
docker run -p 3000:3000 recipe-api:dev
```

### Production

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Or build and run manually
docker build --target production -t recipe-api:prod .
docker run -p 3000:3000 recipe-api:prod
```

### Other Docker Commands

```bash
# Run tests in Docker
docker-compose --profile test run recipe-api-test

# Build and start in background
docker-compose up -d recipe-api

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build recipe-api
```

## Example Usage

### Using curl

```bash
# Create a recipe
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chocolate Cake",
    "ingredients": ["flour", "chocolate", "eggs", "sugar"],
    "instructions": "Mix ingredients and bake at 350°F for 30 minutes",
    "prepTime": 45
  }'

# Get all recipes
curl http://localhost:3000/recipes

# Search for recipes
curl "http://localhost:3000/recipes?search=chocolate"

# Get recipe by ID
curl http://localhost:3000/recipes/{recipe-id}

# Update recipe
curl -X PATCH http://localhost:3000/recipes/{recipe-id} \
  -H "Content-Type: application/json" \
  -d '{"prepTime": 40}'

# Delete recipe
curl -X DELETE http://localhost:3000/recipes/{recipe-id}
```

## Response Format

All API responses follow this format:

**Success Response:**

```json
{
    "success": true,
    "message": "Recipe created successfully",
    "data": {
        "id": "uuid",
        "name": "Recipe Name",
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": "Step by step instructions",
        "prepTime": 30,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

**Error Response:**

```json
{
    "error": "Recipe not found"
}
```

## HTTP Status Codes

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request (missing required fields)
-   `404` - Not Found
-   `500` - Internal Server Error

## Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── data/           # JSON data storage
├── utils.ts        # Helper functions
├── constants.ts    # API constants
├── app.ts          # Express app setup
└── server.ts       # Server entry point

tests/              # Test files
```

## Scripts

-   `npm run dev` - Start development server with hot reload
-   `npm run build` - Build TypeScript to JavaScript
-   `npm start` - Start production server
-   `npm test` - Run tests
-   `npm run test:watch` - Run tests in watch mode

## License

MIT
