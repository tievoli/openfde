@echo off
REM OpenFDE Server Restart Script (Legacy Compatible)
REM Recommendation: Use restart-server.bat or build-and-serve.bat

setlocal enabledelayedexpansion

title OpenFDE Server Restart
color 0A

echo.
echo ========================================
echo   OpenFDE Server Restart Tool
echo ========================================
echo.
echo [INFO] Recommended scripts:
echo   - restart-server.bat    (Fast restart)
echo   - build-and-serve.bat   (Full build)
echo   - dev-serve.bat         (Development mode)
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
echo Step 2: Cleaning cache...
if exist "node_modules\.cache" (
    del /s /q node_modules\.cache 2>nul
    echo [SUCCESS] Cache cleaned
)
if exist "apps\cli\dist\.cache" (
    del /s /q apps\cli\dist\.cache 2>nul
    echo [SUCCESS] CLI cache cleaned
)
timeout /t 2 >nul

echo.
echo Step 3: Rebuilding...
call pnpm -C apps/cli build
if !errorlevel! neq 0 (
    echo [WARNING] Build failed, trying direct run...
) else (
    echo [SUCCESS] Build completed
)
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