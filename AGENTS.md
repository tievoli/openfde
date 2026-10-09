# AGENTS.md - OpenFDE 项目指南

> 本文档为 AI Agents 提供项目的完整结构和开发指南

## 📋 项目概述

**OpenFDE** 是一个本地优先的 AI 工作空间，专为 Forward Deployed Engineers (FDE) 设计。它将客户组织的知识（目标、工作流、决策、约束、数据源、人员和痛点）捕获为类型化、可引用、时间感知的图谱，供人类和编码代理读取和回写。

### 核心特性

- **本体支持的运营记忆** - 固定的 FDE 领域本体约束提取
- **强制溯源的上下文管理** - 参与范围隔离、源引用事实
- **闭环代理操作** - 编码代理声明任务、拉取上下文、执行并写回结果
- **人工介入审查和治理** - 任务状态机控制接受
- **本地优先** - 每个参与一个 SQLite 目录

## 📁 项目目录结构

### 根目录结构

```
openfde/
├── .codegraph/              # 代码图谱分析数据
├── .git/                    # Git 版本控制
├── .omo/                    # OpenCode 元数据 (Git忽略)
├── apps/                    # 应用程序
│   └── cli/                 # 命令行工具
├── docs/                    # 项目文档
├── fixeds/                  # (Git忽略) 测试文件、过程性修改、日志文件
├── node_modules/            # Node.js 依赖 (Git忽略)
├── packages/                # 核心包
│   ├── core/               # 核心功能：ledger、memory、dispatch等
│   ├── ontology/           # FDE领域本体（Zod schema）
│   └── webui/              # Web UI（本地工作空间）
├── scripts/                 # 实用脚本
├── skills/                  # Agent技能
│   └── openfde/            # OpenFDE agent skill
├── 测试材料/                # 测试数据 (Git忽略)
├── .env                     # 环境变量 (Git忽略)
├── .env.example             # 环境变量模板
├── .gitignore               # Git忽略规则
├── ARCHITECTURE.md          # 架构文档
├── LICENSE                  # 许可证
├── README.md                # 项目说明
├── README.zh-CN.md          # 项目说明（中文）
├── README.ja.md             # 项目说明（日文）
├── README.es.md             # 项目说明（西班牙文）
├── package.json             # 项目配置
├── pnpm-lock.yaml           # 依赖锁定文件
├── pnpm-workspace.yaml      # pnpm工作空间配置
├── tsconfig.json            # TypeScript配置
└── tsconfig.base.json       # TypeScript基础配置
```

### 核心目录详解

#### 📦 packages/ - 核心包

```
packages/
├── ontology/                # FDE领域本体定义
│   ├── src/
│   │   ├── schema.ts       # Zod schema定义（单一数据源）
│   │   └── types.ts        # TypeScript类型
│   └── package.json
│
├── core/                    # 核心功能实现
│   ├── src/
│   │   ├── engagement/     # 参与管理
│   │   ├── memory/         # 记忆存储和检索
│   │   ├── dispatch/       # 任务调度
│   │   ├── projections/    # 投影和报告
│   │   ├── extraction/     # 本体约束提取
│   │   └── retrieval/      # 混合检索（BM25+图谱）
│   └── package.json
│
└── webui/                   # Web用户界面
    ├── src/
    │   ├── index.html      # 主HTML
    │   ├── server.ts       # 本地服务器
    │   └── components/     # UI组件
    └── package.json
```

**关键职责**:
- `ontology/`: 定义所有领域实体、关系和约束
- `core/`: 实现所有业务逻辑和数据层
- `webui/`: 提供本地工作空间和可视化

#### 🚀 apps/ - 应用程序

```
apps/
└── cli/                     # 命令行工具
    ├── src/
    │   ├── index.ts        # CLI入口点
    │   └── commands/       # 各个子命令
    │       ├── engagement.ts
    │       ├── ingest.ts
    │       ├── extract.ts
    │       ├── recall.ts
    │       ├── task.ts
    │       ├── serve.ts
    │       └── ...
    └── package.json
```

**关键职责**:
- 提供人类和代理的统一入口点
- 所有命令支持 `--json` 输出
- 与 FDE.md 集成

#### 📄 docs/ - 项目文档

```
docs/
├── PROJECT_STRUCTURE.md     # 项目结构说明
├── fde-md.md               # FDE.md规范说明
├── notes-ui.png            # UI截图
├── flows-ui.png            # 流程图UI
├── graph-ui.png            # 图谱UI
├── pages-ui.png            # 页面UI
├── report-ui.png           # 报告UI
├── canvas-ui.png           # 画布UI
└── todo-ui.png             # Todo UI
```

**关键职责**:
- 存储所有项目文档
- UI截图和说明
- 规范文档

#### 🔧 scripts/ - 实用脚本

```
scripts/
├── integrate-ui.js          # UI集成脚本
├── integrate-ui-v2.js       # UI集成脚本v2
├── WEB_UI_ENHANCEMENTS.js   # UI增强功能
├── fix-buttons.js           # 按钮修复脚本
├── RESTART_SERVER.bat       # 服务器重启脚本
└── restart-server.bat       # 服务器重启脚本（备用）
```

**关键职责**:
- 开发和部署辅助脚本
- UI集成和增强
- 服务器管理

#### 🎓 skills/ - Agent技能

```
skills/
└── openfde/                # OpenFDE agent skill
    ├── SKILL.md            # 技能说明
    └── ...
```

**关键职责**:
- 指导agents如何安装和操作CLI
- 与 FDE.md 集成
- 提供任务协议

#### 🗑️ fixeds/ - 临时文件（Git忽略）

```
fixeds/
├── *.log                   # 日志文件
├── *.md                    # 过程性文档
└── nul                     # 空文件
```

**关键职责**:
- 测试文件和调试输出
- 过程性修改记录
- 临时文档和日志

**注意**: 此目录在Git中被忽略，所有内容不会提交到版本控制

## 🔧 技术栈

- **语言**: TypeScript
- **包管理**: pnpm (workspace)
- **构建工具**: tsup, Vite
- **测试框架**: Vitest
- **数据库**: SQLite (better-sqlite3)
- **Schema验证**: Zod
- **AI集成**: Anthropic Claude API

## 🎯 开发工作流

### 安装和设置

```bash
# 安装依赖
pnpm install

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加 API 密钥
# ANTHROPIC_API_KEY=your_key_here
```

### 常用命令

```bash
# 测试
pnpm test

# 类型检查
pnpm typecheck

# 构建CLI
pnpm -C apps/cli build

# 启动开发服务器
pnpm openfde serve

# 创建新参与
pnpm openfde engagement create "acme corp"

# 提取知识
pnpm openfde extract

# 搜索记忆
pnpm openfde recall "data source"
```

### 代码规范

1. **类型安全**: 严格的 TypeScript，禁用 `any`
2. **Schema先行**: 所有数据结构在 `ontology/` 中定义
3. **强制溯源**: 所有事实必须有源URI
4. **测试覆盖**: 新功能必须有测试
5. **文档同步**: API 变更必须更新文档

## 📝 重要文件说明

### 配置文件

| 文件 | 用途 |
|------|------|
| `package.json` | 项目配置和依赖 |
| `pnpm-workspace.yaml` | pnpm工作空间定义 |
| `tsconfig.json` | TypeScript配置 |
| `tsconfig.base.json` | 共享TypeScript配置 |
| `.env.example` | 环境变量模板 |
| `.gitignore` | Git忽略规则 |

### 核心文档

| 文件 | 用途 |
|------|------|
| `README.md` | 项目主文档 |
| `ARCHITECTURE.md` | 架构设计文档 |
| `docs/PROJECT_STRUCTURE.md` | 项目结构说明 |
| `docs/fde-md.md` | FDE.md规范 |

### 代理相关

| 文件 | 用途 |
|------|------|
| `AGENTS.md` | 本文件 - 代理指南 |
| `skills/openfde/SKILL.md` | OpenFDE技能说明 |
| `FDE.md` | (生成) 部署简报 |

## 🚫 Git忽略规则

以下内容在Git中被忽略：

```
# 依赖
node_modules/

# 构建输出
dist/
.turbo/

# 环境变量
.env
.env.*

# 日志和系统文件
*.log
.DS_Store
.gstack/

# 临时文件
fixeds/
.omo/
*.backup
测试材料/
nul
```

## 🔄 数据流

```
用户输入 (ingest)
    ↓
本体约束提取 (extract)
    ↓
记忆存储 (memory)
    ↓
混合检索 (recall)
    ↓
任务调度 (task)
    ↓
代理执行 (dispatch)
    ↓
结果回写 (remember)
```

## 🎨 架构原则

1. **本地优先**: 客户数据从不离开本地机器
2. **本体驱动**: Schema是单一数据源
3. **强制溯源**: 无源URI的内容被拒绝
4. **双时态记忆**: 矛盾事实取代而非删除
5. **代理原生**: 所有命令支持 `--json`

## 📊 项目状态

- ✅ 核心功能已实现
- ✅ CLI可用
- ✅ Web UI可用
- ✅ 本体定义完整
- 🚧 持续优化中

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 确保测试通过
4. 更新文档
5. 提交 Pull Request

## 📞 支持

- 文档: `docs/`
- 问题: GitHub Issues
- 讨论: GitHub Discussions

---

**最后更新**: 2026-10-09
**维护者**: OpenFDE Team
**版本**: 1.0.0