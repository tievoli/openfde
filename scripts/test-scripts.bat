@echo off
REM OpenFDE Script Test Tool
REM Purpose: Verify script paths and basic functionality

setlocal enabledelayedexpansion

title OpenFDE Script Test
color 0E

echo.
echo ========================================
echo   OpenFDE Script Test Tool
echo ========================================
echo.

REM Test 1: Path switching
echo [Test 1] Path Switching Test
cd /d "%~dp0\.."
echo Current directory: %CD%
if exist "package.json" (
    echo [SUCCESS] Correctly switched to project root
) else (
    echo [FAILED] package.json not found
    pause
    exit /b 1
)
echo.

REM Test 2: Check pnpm
echo [Test 2] pnpm Installation Check
where pnpm >nul 2>&1
if !errorlevel! equ 0 (
    echo [SUCCESS] pnpm is installed
    for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo Version: !PNPM_VERSION!
) else (
    echo [FAILED] pnpm not installed
    echo Please run: npm install -g pnpm
)
echo.

REM Test 3: Check Node.js
echo [Test 3] Node.js Installation Check
where node >nul 2>&1
if !errorlevel! equ 0 (
    echo [SUCCESS] Node.js is installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Version: !NODE_VERSION!
) else (
    echo [FAILED] Node.js not installed
)
echo.

REM Test 4: Check project structure
echo [Test 4] Project Structure Check
if exist "apps\cli" (
    echo [SUCCESS] apps/cli directory exists
) else (
    echo [FAILED] apps/cli directory not found
)
if exist "packages\core" (
    echo [SUCCESS] packages/core directory exists
) else (
    echo [FAILED] packages/core directory not found
)
if exist "packages\ontology" (
    echo [SUCCESS] packages/ontology directory exists
) else (
    echo [FAILED] packages/ontology directory not found
)
if exist "packages\webui" (
    echo [SUCCESS] packages/webui directory exists
) else (
    echo [FAILED] packages/webui directory not found
)
echo.

REM Test 5: Check dependencies
echo [Test 5] Dependencies Installation Check
if exist "node_modules" (
    echo [SUCCESS] node_modules exists
) else (
    echo [FAILED] node_modules not found, please run pnpm install
)
echo.

echo ========================================
echo   Test Completed
echo ========================================
echo.
echo All basic checks completed.
echo To start the server, run:
echo   - restart-server.bat (Fast restart)
echo   - build-and-serve.bat (Full build)
echo   - dev-serve.bat (Development mode)
echo.

pause