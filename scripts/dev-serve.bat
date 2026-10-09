@echo off
REM OpenFDE 开发模式启动脚本
REM 用途: 启动服务器并监视文件变化（开发模式）

setlocal enabledelayedexpansion

title OpenFDE Development Mode
color 0B

echo.
echo ========================================
echo   OpenFDE 开发模式
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

echo.
echo 开发模式说明:
echo - 使用 tsx 直接运行 TypeScript
echo - 自动重载未实现（需手动重启）
echo - 适用于快速开发和测试
echo.
echo ========================================
echo   按 Ctrl+C 可以停止服务器
echo ========================================
echo.

pnpm openfde serve

pause