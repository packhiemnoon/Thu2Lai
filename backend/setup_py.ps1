Write-Host "Starting Python environment setup for Windows..." -ForegroundColor Cyan

# 1. Locate Python executable (try 'py' launcher first, then 'python')
$pythonCmd = $null
foreach ($candidate in @("py", "python", "python3")) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) {
        $pythonCmd = $candidate
        break
    }
}

if (-not $pythonCmd) {
    Write-Host "[ERROR] Python is not installed or not in your PATH. Please install Python from python.org." -ForegroundColor Red
    exit 1
}

$pyVersion = & $pythonCmd --version 2>&1
Write-Host "[OK] Found Python: $pyVersion (via '$pythonCmd')" -ForegroundColor Green

# 2. Detect and fix Linux-style venv on Windows
if (Test-Path "venv") {
    $hasScripts = Test-Path "venv\Scripts"
    if (-not $hasScripts) {
        Write-Host "[WARN] Detected non-Windows virtual environment. Recreating..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force venv
    }
}

# 3. Create venv if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Creating virtual environment..." -ForegroundColor Yellow
    & $pythonCmd -m venv venv

    if ($LASTEXITCODE -ne 0 -or -not (Test-Path "venv\Scripts\python.exe")) {
        Write-Host "[ERROR] Failed to create virtual environment. Aborting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "[OK] Virtual environment ready." -ForegroundColor Green

# 4. Set paths using absolute pathing
$root = Get-Location
$pip       = "$root\venv\Scripts\pip.exe"
$pythonExe = "$root\venv\Scripts\python.exe"

# 5. Install dependencies
Write-Host "[INFO] Installing dependencies..." -ForegroundColor Cyan
& $pythonExe -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] pip upgrade failed." -ForegroundColor Red; exit 1 }

& $pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] Dependency installation failed." -ForegroundColor Red; exit 1 }

# 6. Initialize tltk
Write-Host "[INFO] Initializing tltk..." -ForegroundColor Cyan
& $pythonExe -c "from tltk import th2ipa; print('tltk is ready!')"
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] tltk initialization failed." -ForegroundColor Red; exit 1 }

Write-Host "[OK] Setup complete!" -ForegroundColor Green
Write-Host "Note: PYTHON_PATH=./venv/Scripts/python.exe"