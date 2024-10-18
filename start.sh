#!/bin/bash

# Start clip server
echo "Starting Clip Server..."
python -m clip_server &

# Create Postgres Database Project
echo "Creating Postgres Database Project..."
psql -c "\c project"

# Wait for a minute before starting backend API
sleep 60 # adjust the sleep time as needed

# Start Backend API
echo "Starting Backend API..."
npm run api &
Backendpid=$!

# Wait for some seconds 
sleep 30 

# Check if node.js is running
if ! ps aux | grep $Backendpid | grep node &> /dev/null; then 
    echo "Error starting backend"
    exit 1
fi

# Function to stop the backend API
stop_backend() {
    pkill -f npm run api
}

# Function to stop the frontend development server
stop_frontend() {
    pkill -f npm run dev
}

echo "Started all services. To stop a service, use one of the following commands:"
echo "  * stop_backend"
echo "  * stop_frontend"

read -p "Press enter to keep running or type 'stop' to exit: "

if [ "$REPLY" = "stop" ]; then
    # Stop backend API
    stop_backend

    # Wait for some seconds 
    sleep 30 

    # Check if node.js is stopped
    if ps aux | grep $Backendpid | grep node &> /dev/null; then 
        echo "Error stopping backend"
    fi
    # Wait another minute before stopping frontend development server
    sleep 60 # adjust the sleep time as needed

    # Stop Frontend Development Server
    stop_frontend
else
    # Keep running all services
fi
