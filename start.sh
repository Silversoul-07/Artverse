#!/bin/bash

# Start the Next.js app
echo "Starting Next.js app..."
npm run dev --prefix ArtCore > /dev/null 2>&1 &
echo "Started Next.js app..."

# Start the FastAPI backend
# echo "Starting FastAPI backend..."
# uvicorn ArtEngine.main:app --reload --host 0.0.0.0 --port 8000 &

# Start the web scraper FastAPI server
# echo "Starting web scraper server..."
# uvicorn scraper.main:app --reload --host 0.0.0.0 --port 8001 &

# Start the Clip server
echo "Starting Clip server..."
python3 -m clip_server > /dev/null 2>&1 &
echo "Started Clip server..."

# Wait for all background processes to finish
wait