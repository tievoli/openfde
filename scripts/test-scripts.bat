@echo off
REM OpenFDE 脚本测试工具
REM 用途: 验证脚本路径和基本功能

setlocal enabledelayedexpansion

title OpenFDE Script Test
color 0E

echo.
echo ========================================
echo   OpenFDE 脚本测试工具
echo ========================================
echo.

REM 测试 1: 路径切换
echo [测试 1] 路径切换测试
cd /d "%~dp0\.."
echo 当前目录: %CD%
if exist "package.json" (
    echo [成功] 已正确切换到项目根目录
) else (
    echo [失败] 未找到 package.json
    pause
    exit /b 1
)
echo.

REM 测试 2: 检查 pnpm
echo [测试 2] pnpm 安装检查
where pnpm >nul 2>&1
if !errorlevel! equ 0 (
    echo [成功] pnpm 已安装
    for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
    echo 版本: !PNPM_VERSION!
) else (
    echo [失败] pnpm 未安装
    echo 请运行: npm install -g pnpm
)
echo.

REM 测试 3: 检查 Node.js
echo [测试 3] Node.js 安装检查
where node >nul 2>&1
if !errorlevel! equ 0 (
    echo [成功] Node.js 已安装
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo 版本: !NODE_VERSION!
) else (
    echo [失败] Node.js 未安装
)
echo.

REM 测试 4: 检查项目结构
echo [测试 4] 项目结构检查
if exist "apps\cli" (
    echo [成功] apps/cli 目录存在
) else (
    echo [失败] apps/cli 目录不存在
)
if exist "packages\core" (
    echo [成功] packages/core 目录存在
) else (
    echo [失败] packages/core 目录不存在
)
if exist "packages\ontology" (
    echo [成功] packages/ontology 目录存在
) else (
    echo [失败] packages/ontology 目录不存在
)
if exist "packages\webui" (
    echo [成功] packages/webui 目录存在
) else (
    echo [失败] packages/webui 目录不存在
)
echo.

REM 测试 5: 检查依赖安装
echo [测试 5] 依赖安装检查
if exist "node_modules" (
    echo [成功] node_modules 存在
) else (
    echo [失败] node_modules 不存在，请运行 pnpm install
)
echo.

echo ========================================
echo   测试完成
echo ========================================
echo.
echo 所有基础检查已完成。
echo 如需启动服务器，请运行:
echo   - restart-server.bat (快速重启)
echo   - build-and-serve.bat (完整构建)
echo   - dev-serve.bat (开发模式)
echo.

pause