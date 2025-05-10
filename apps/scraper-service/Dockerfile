FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY apps/scraper-service/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY apps/scraper-service .
COPY libs/proto ./proto

# Generate gRPC code
RUN python -m grpc_tools.protoc -I./proto --python_out=. --grpc_python_out=. ./proto/*.proto

# Expose port
EXPOSE 5000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"] 