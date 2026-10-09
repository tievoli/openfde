@echo off
echo 强制终止所有 Node.js 进程...
taskkill /F /IM node.exe /T
timeout /t 3
echo 启动新服务器...
cd /d D:\workspace\openfde
pnpm openfde serve