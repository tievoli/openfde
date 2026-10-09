@echo off
REM OpenFDE Development Mode Script
REM Purpose: Start server in development mode

setlocal enabledelayedexpansion

title OpenFDE Development Mode
color 0B

echo.
echo ========================================
echo   OpenFDE Development Mode
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

echo.
echo Development Mode Info:
echo - Running TypeScript directly with tsx
echo - No auto-reload (manual restart required)
echo - Suitable for quick development and testing
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

pnpm openfde serve

pause