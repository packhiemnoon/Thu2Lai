#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Python environment setup..."

# Check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install it first."
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists."
fi

# Upgrade pip and install dependencies using the venv's pip directly
echo "📥 Installing Python dependencies from requirements.txt..."
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# Initializing tltk (it often downloads data on first use)
echo "🧪 Initializing tltk data..."
./venv/bin/python3 -c "from tltk import th2ipa; print('tltk is ready!')"

echo "✅ Python setup complete!"
echo "--------------------------------------------------"
echo "Note: Your .env should have: PYTHON_PATH=./venv/bin/python"
echo "--------------------------------------------------"
