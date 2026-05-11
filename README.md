# Thu2Lai — Thai to Lu Language Translator

Thu2Lai (ทูทูไล) is a web app that translates Thai text into the **Lu Colloquialism** (ภาษาลู) and reads the result aloud using AI text-to-speech.

## Stack

| Layer | Tech |
|---|---|
| Frontend | HTML/CSS/JS, Express (static server) |
| Backend | Node.js, Express 5, MongoDB, JWT, bcrypt |
| Translation | Python 3 (tltk, pandas) via child process |
| TTS | ElevenLabs API |

## Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB instance
- ElevenLabs API key

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/packhiemnoon/Thu2Lai.git
cd Thu2Lai
```

### 2. Backend

```bash
cd backend
npm install
```

Set up the Python virtual environment:

**Linux/macOS**
```bash
bash setup_py.sh
```

**Windows (PowerShell)**
```powershell
.\setup_py.ps1
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGO_URL=<your MongoDB connection string>
JWT_SECRET=<a strong secret>
ELEVENLABS_API_KEY=<your ElevenLabs API key>

# Linux/macOS
PYTHON_PATH=./venv/bin/python

# Windows
PYTHON_PATH=./venv/Scripts/python.exe
```

### 3. Frontend

```bash
cd frontend
npm install
```

## Running

Start both servers (in separate terminals):

```bash
# Backend (port 5000)
cd backend && npm start

# Frontend (port 3000)
cd frontend && npm start
```

Then open `http://localhost:3000` in your browser.

For development with auto-reload:

```bash
npm run dev
```
