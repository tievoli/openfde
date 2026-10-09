@echo off
REM OpenFDE 完整构建和启动脚本
REM 用途: 清理缓存、重新构建并启动服务器

setlocal enabledelayedexpansion

title OpenFDE Build and Serve
color 0A

echo.
echo ========================================
echo   OpenFDE 构建和启动工具
echo ========================================
echo.

REM 切换到项目根目录
cd /d "%~dp0\.."
echo 当前目录: %CD%
echo.

REM 检查 package.json 是否存在
if not exist "package.json" (
    echo [错误] 未找到 package.json
    echo 请确保脚本位于 scripts 目录下
    pause
    exit /b 1
)

REM 检查 pnpm 是否安装
where pnpm >nul 2>&1
if !errorlevel! neq 0 (
    echo [错误] 未找到 pnpm 命令
    echo 请先安装 pnpm: npm install -g pnpm
    pause
    exit /b 1
)

echo 步骤 1: 终止所有 Node.js 进程...
taskkill /F /IM node.exe /T 2>nul
if !errorlevel! equ 0 (
    echo [成功] Node.js 进程已终止
) else (
    echo [提示] 未找到运行中的 Node.js 进程
)
timeout /t 2 >nul

echo.
echo 步骤 2: 清理缓存和构建输出...
if exist "node_modules\.cache" (
    del /s /q node_modules\.cache 2>nul
    echo [成功] 已清理 node_modules\.cache
)
if exist "apps\cli\dist" (
    del /s /q apps\cli\dist 2>nul
    echo [成功] 已清理 apps\cli\dist
)
if exist "packages\core\dist" (
    del /s /q packages\core\dist 2>nul
    echo [成功] 已清理 packages\core\dist
)
timeout /t 2 >nul

echo.
echo 步骤 3: 重新构建 CLI...
call pnpm -C apps/cli build
if !errorlevel! neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)
echo [成功] 构建完成
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