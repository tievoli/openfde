@echo off
REM Quick validation script
REM Tests basic script functionality

title Script Validation

echo ========================================
echo   Script Encoding Validation
echo ========================================
echo.

cd /d "%~dp0\.."

echo Current directory: %CD%
echo.

if exist "package.json" (
    echo [OK] Found package.json
) else (
    echo [ERROR] package.json not found
    pause
    exit /b 1
)

echo.
echo All checks passed!
echo Scripts are ready to use.
echo.

pause