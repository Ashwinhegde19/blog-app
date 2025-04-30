#!/bin/bash

# Exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run migrations for the database
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput