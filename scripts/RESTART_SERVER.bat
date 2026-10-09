@echo off
title OpenFDE Server Restart
color 0A

echo.
echo ========================================
echo   OpenFDE 服务器重启工具
echo ========================================
echo.
echo 步骤 1: 终止所有 Node.js 进程...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 >nul

echo.
echo 步骤 2: 清理缓存...
cd /d "%~dp0"
del /s /q node_modules\.cache 2>nul
del /s /q apps\cli\dist\.cache 2>nul

echo.
echo 步骤 3: 重新构建...
call pnpm -C apps/cli build
timeout /t 2 >nul

echo.
echo 步骤 4: 启动服务器...
echo.
echo ✅ 服务器启动中...
echo 📍 访问地址: http://localhost:4517
echo.
echo ========================================
echo   按 Ctrl+C 可以停止服务器
echo ========================================
echo.

pnpm openfde serve

pause