# OpenFDE 项目结构

本文档描述 OpenFDE 项目的目录结构和文件组织方式。

## 目录结构

```
openfde/
├── .codegraph/          # 代码图谱分析数据
├── .git/                # Git 版本控制
├── .omo/                # OpenCode 元数据
├── apps/                # 应用程序
│   └── cli/             # 命令行工具
├── docs/                # 项目文档
├── fixeds/              # (Git忽略) 测试文件、过程性修改、日志文件
├── node_modules/        # Node.js 依赖
├── packages/            # 核心包
│   ├── core/           # 核心功能：ledger、memory、dispatch等
│   ├── ontology/       # FDE领域本体（Zod schema）
│   └── webui/          # Web UI（本地工作空间）
├── scripts/             # 实用脚本
│   ├── integrate-ui.js            # UI集成脚本
│   ├── integrate-ui-v2.js         # UI集成脚本v2
│   ├── WEB_UI_ENHANCEMENTS.js     # UI增强功能
│   ├── fix-buttons.js             # 按钮修复脚本
│   ├── RESTART_SERVER.bat         # 服务器重启脚本
│   └── restart-server.bat         # 服务器重启脚本（备用）
├── skills/              # Agent技能
│   └── openfde/        # OpenFDE agent skill
├── 测试材料/            # 测试数据
├── .env                 # 环境变量（Git忽略）
├── .env.example         # 环境变量模板
├── .gitignore           # Git忽略规则
├── ARCHITECTURE.md      # 架构文档
├── LICENSE              # 许可证
├── README.md            # 项目说明
├── README.zh-CN.md      # 项目说明（中文）
├── README.ja.md         # 项目说明（日文）
├── README.es.md         # 项目说明（西班牙文）
├── package.json         # 项目配置
├── pnpm-lock.yaml       # 依赖锁定文件
├── pnpm-workspace.yaml  # pnpm工作空间配置
├── tsconfig.json        # TypeScript配置
└── tsconfig.base.json   # TypeScript基础配置
```

## 目录说明

### 核心目录

- **packages/**: 核心功能包
  - `ontology/`: FDE领域本体定义，使用Zod schema，是单一数据源
  - `core/`: 核心功能实现，包括engagement管理、memory操作、dispatch、projections、reports等
  - `webui/`: 可选的本地工作空间，提供notes + graph + views + executive report功能

- **apps/**: 应用程序
  - `cli/`: 命令行工具，是人类和agents的共享入口点

- **skills/**: Agent集成
  - `openfde/`: OpenFDE agent skill，指导agents如何安装和操作CLI

- **docs/**: 项目文档

- **scripts/**: 实用脚本
  - 包含开发和部署过程中使用的各种脚本文件
  - 目前包含UI集成、增强功能、服务器管理等脚本

### 临时目录

- **fixeds/**: (Git忽略)
  - 测试文件
  - 过程性修改记录
  - 日志文件 (*.log)
  - 调试用的临时文档
  - **注意**: 此目录在Git中被忽略，所有内容不会提交到版本控制

- **测试材料/**: 测试数据

## Git忽略规则

项目配置了以下Git忽略规则：

- `node_modules/`: Node.js依赖
- `dist/`: 构建输出
- `.turbo/`: Turborepo缓存
- `.env`: 环境变量文件
- `*.log`: 所有日志文件
- `fixeds/`: 测试和临时文件目录
- `nul`: 空文件
- `.DS_Store`: macOS系统文件
- `.gstack/`: gstack工具文件

## 文件命名规范

- **README*.md**: 多语言项目说明文档
- **ARCHITECTURE.md**: 架构文档
- **CONFIGURATION.md**: 配置文档（已移至fixeds/）
- **.env.example**: 环境变量模板

## 开发工作流

1. **安装依赖**: `pnpm install`
2. **测试**: `pnpm test`
3. **类型检查**: `pnpm typecheck`
4. **构建CLI**: `pnpm -C apps/cli build`

## 文档索引

- [README.md](../README.md) - 项目主文档
- [ARCHITECTURE.md](../ARCHITECTURE.md) - 架构设计
- [docs/fde-md.md](fde-md.md) - FDE.md规范说明

---

**最后更新**: 2026-10-09
**维护者**: OpenFDE Team