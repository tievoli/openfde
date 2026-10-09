@echo off
REM OpenFDE Build and Serve Script
REM Purpose: Clean cache, rebuild and start server

setlocal enabledelayedexpansion

title OpenFDE Build and Serve
color 0A

echo.
echo ========================================
echo   OpenFDE Build and Serve Tool
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

REM Check if pnpm is installed
where pnpm >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] pnpm command not found
    echo Please install pnpm first: npm install -g pnpm
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
echo Step 2: Cleaning cache and build output...
if exist "node_modules\.cache" (
    del /s /q node_modules\.cache 2>nul
    echo [SUCCESS] Cleaned node_modules\.cache
)
if exist "apps\cli\dist" (
    del /s /q apps\cli\dist 2>nul
    echo [SUCCESS] Cleaned apps\cli\dist
)
if exist "packages\core\dist" (
    del /s /q packages\core\dist 2>nul
    echo [SUCCESS] Cleaned packages\core\dist
)
timeout /t 2 >nul

echo.
echo Step 3: Rebuilding CLI...
call pnpm -C apps/cli build
if !errorlevel! neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Build completed
timeout /t 2 >nul

echo.
echo Step 4: Starting server...
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