@echo off
REM OpenFDE Fast Restart Script
REM Purpose: Terminate existing Node.js processes and start server

setlocal enabledelayedexpansion

title OpenFDE Fast Restart
color 0A

echo.
echo ========================================
echo   OpenFDE Fast Restart Tool
echo ========================================
echo.

REM Switch to project root directory
cd /d "%~dp0\.."
echo Current directory: %CD%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please ensure the script is in the scripts directory
    pause
    exit /b 1
)

echo Step 1: Terminating all Node.js processes...
taskkill /F /IM node.exe /T 2>nul
if !errorlevel! equ 0 (
    echo [SUCCESS] Node.js processes terminated
) else (
    echo [INFO] No running Node.js processes found
)
timeout /t 2 >nul

echo.
echo Step 2: Starting server...
echo.
echo [OK] Server starting...
echo [INFO] Access URL: http://localhost:4517
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

pnpm openfde serve

pause