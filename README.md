# AI Chatbot Platform

A microservices-based AI chatbot platform built with NestJS and FastAPI.

## Architecture

The platform consists of the following services:

### NestJS Services
- API Gateway: Central entry point for all client requests
- User Service: Handles user authentication and profile management
- Payment Service: Manages subscriptions and billing
- Project Service: Manages projects and bots

### FastAPI Services
- Scraper Service: Handles document and webpage content extraction
- Embedder Service: Generates and manages text embeddings
- NLP Service: Handles intent detection and response generation

### Database
- PostgreSQL with pgvector extension for vector similarity search

## Prerequisites

- Node.js (v18 or later)
- Python (v3.9 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chatbot-platform
```

2. Install dependencies:
```bash
# Install NestJS dependencies
npm install

# Install Python dependencies for FastAPI services
cd apps/scraper-service && pip install -r requirements.txt
cd ../embedder-service && pip install -r requirements.txt
cd ../nlp-service && pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the services:
```bash
# Start all services using Docker Compose
docker-compose up -d

# Or start services individually
npm run start:dev # For NestJS services
cd apps/scraper-service && uvicorn main:app --reload
cd ../embedder-service && uvicorn main:app --reload
cd ../nlp-service && uvicorn main:app --reload
```

## Development

### NestJS Services
- Located in `apps/` directory
- Each service has its own module structure
- Uses TypeORM for database operations
- gRPC for internal service communication

### FastAPI Services
- Located in `apps/` directory
- Each service has its own requirements.txt
- Uses SQLAlchemy for database operations
- gRPC for internal service communication

## API Documentation

- NestJS Services: http://localhost:3000/api/docs
- FastAPI Services:
  - Scraper: http://localhost:5000/docs
  - Embedder: http://localhost:5001/docs
  - NLP: http://localhost:5002/docs

## Testing

```bash
# Run NestJS tests
npm run test

# Run FastAPI tests
cd apps/scraper-service && pytest
cd ../embedder-service && pytest
cd ../nlp-service && pytest
```

## License

MIT 