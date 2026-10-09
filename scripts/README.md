# OpenFDE 脚本说明

本目录包含用于开发和部署的实用脚本。

## 📁 脚本列表

### 🚀 启动脚本

#### `restart-server.bat`
**快速重启脚本**
- 用途: 终止现有 Node.js 进程并快速启动服务器
- 适用于: 日常开发和快速重启
- 执行步骤:
  1. 终止所有 Node.js 进程
  2. 启动 OpenFDE 服务器

**使用方法:**
```bash
# 双击运行，或在命令行执行:
.\scripts\restart-server.bat
```

---

#### `build-and-serve.bat`
**完整构建和启动脚本**
- 用途: 清理缓存、重新构建并启动服务器
- 适用于: 首次启动、清理环境、完整重建
- 执行步骤:
  1. 终止所有 Node.js 进程
  2. 清理缓存和构建输出
  3. 重新构建 CLI
  4. 启动 OpenFDE 服务器

**使用方法:**
```bash
# 双击运行，或在命令行执行:
.\scripts\build-and-serve.bat
```

---

#### `dev-serve.bat`
**开发模式启动脚本**
- 用途: 使用 tsx 直接运行 TypeScript（开发模式）
- 适用于: 快速开发和测试
- 特点:
  - 无需构建步骤
  - 使用 tsx 运行 TypeScript
  - 快速启动

**使用方法:**
```bash
# 双击运行，或在命令行执行:
.\scripts\dev-serve.bat
```

---

#### `RESTART_SERVER.bat`
**兼容旧版本脚本**
- 用途: 原有的重启脚本，保持向后兼容
- 功能与 `build-and-serve.bat` 类似
- 建议: 使用新的脚本替代

---

### 🔧 JavaScript 脚本

#### `integrate-ui.js`
**UI 集成脚本**
- 用途: 集成 UI 组件到项目中

#### `integrate-ui-v2.js`
**UI 集成脚本 v2**
- 用途: 增强版 UI 集成脚本

#### `WEB_UI_ENHANCEMENTS.js`
**Web UI 增强功能**
- 用途: 添加 UI 增强功能

#### `fix-buttons.js`
**按钮修复脚本**
- 用途: 修复 UI 中的按钮问题

---

## 📝 使用建议

### 日常开发
```bash
# 快速重启
.\scripts\restart-server.bat
```

### 首次运行或遇到问题时
```bash
# 完整构建
.\scripts\build-and-serve.bat
```

### 开发调试
```bash
# 开发模式
.\scripts\dev-serve.bat
```

---

## ⚠️ 注意事项

1. **路径问题**: 所有脚本都会自动切换到项目根目录，无需手动调整路径
2. **权限要求**: 终止 Node.js 进程需要管理员权限
3. **依赖检查**: 脚本会检查 `pnpm` 是否已安装
4. **构建缓存**: 如果遇到问题，建议使用 `build-and-serve.bat` 清理缓存

---

## 🔍 故障排除

### 问题: 脚本无法运行
**解决方案:**
1. 检查是否在项目根目录
2. 确认 `pnpm` 已安装
3. 检查 `package.json` 是否存在

### 问题: 端口被占用
**解决方案:**
1. 使用 `restart-server.bat` 终止进程
2. 或手动查找并终止占用端口的进程

### 问题: 构建失败
**解决方案:**
1. 运行 `build-and-serve.bat` 清理缓存
2. 检查依赖是否正确安装: `pnpm install`
3. 检查 Node.js 版本是否符合要求 (>=22)

---

## 📞 支持

如有问题，请参考:
- 项目文档: `docs/`
- 主文档: `README.md`
- 架构文档: `ARCHITECTURE.md`

---

**最后更新**: 2026-10-09
**维护者**: OpenFDE Team