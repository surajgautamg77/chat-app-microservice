#!/bin/bash

# Kill any existing Node.js processes on ports 3000, 3001, and 3002
echo "Killing existing processes..."
lsof -ti:3000,3001,3002 | xargs kill -9 2>/dev/null

# Start Users Service
echo "Building and Starting Users Service..."
cd users-service
npm run build
npm run start:dev &
USERS_PID=$!

# Wait for Users Service to start
sleep 5

# Start Projects Service
echo "Building and Starting Projects Service..."
cd ../projects-service
npm run build
npm run start:dev &
PROJECTS_PID=$!

# Wait for Projects Service to start
sleep 5

# Start API Gateway
echo "Building and Starting API Gateway..."
cd ../api-gateway
npm run build
npm run start:dev &
GATEWAY_PID=$!

# Function to handle script termination
cleanup() {
    echo "Shutting down services..."
    kill $USERS_PID $PROJECTS_PID $GATEWAY_PID 2>/dev/null
    exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "All services are running. Press Ctrl+C to stop all services."
wait 