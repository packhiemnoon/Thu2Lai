#!/bin/bash

# Exit on error
set -e

# ANSI Color Codes
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting Python environment setup for Linux/macOS...${NC}"

# 1. Check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed. Please install it first.${NC}"
    exit 1
fi

# 2. Detect and fix Windows-style venv on Linux
if [ -d "venv" ]; then
    if [ ! -d "venv/bin" ]; then
        echo -e "${YELLOW}⚠️ Detected non-Linux virtual environment. Recreating...${NC}"
        rm -rf venv
    fi
fi

# 3. Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# 4. Success message if venv exists
if [ -d "venv" ]; then
    echo -e "${GREEN}✅ Virtual environment ready.${NC}"
fi

# 5. Upgrade pip and install dependencies
echo -e "${CYAN}📥 Installing dependencies...${NC}"
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# 6. Initializing tltk (it often downloads data on first use)
echo -e "${CYAN}🧪 Initializing tltk...${NC}"
./venv/bin/python3 -c "from tltk import th2ipa; print('tltk is ready!')"

echo -e "${GREEN}✅ Setup complete!${NC}"
echo "--------------------------------------------------"
echo "Note: Your .env should have: PYTHON_PATH=./venv/bin/python"
echo "--------------------------------------------------"
