#!/bin/bash

# Start production Django server with Gunicorn
# This handles multiple concurrent users much better than the development server

echo "Starting production Django server with Gunicorn..."
echo "This can handle multiple concurrent users for presentations"

cd "$(dirname "$0")"
source django_venv/bin/activate
cd scam_detection_api

# Start Gunicorn with multiple workers
gunicorn --bind 0.0.0.0:8000 --workers 4 --worker-class sync --timeout 30 scam_detection_api.wsgi:application

echo "Production server stopped" 