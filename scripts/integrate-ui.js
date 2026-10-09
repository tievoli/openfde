#!/usr/bin/env node
/**
 * OpenFDE Web UI 功能集成脚本
 * 自动将增强功能集成到现有 index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'packages/webui/src/index.html');
const enhancementsPath = path.join(__dirname, 'WEB_UI_ENHANCEMENTS.js');

// 读取原文件
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const enhancements = fs.readFileSync(enhancementsPath, 'utf8');

// 提取各部分代码
const cssMatch = enhancements.match(/\/\* ===== 1.*?===== \*\/\n([\s\S]*?)\/\* ===== 2/);
const htmlMatch = enhancements.match(/<!-- ===== 2.*?===== -->\n([\s\S]*?)<!-- ===== 3/);
const modalMatch = enhancements.match(/<!-- ===== 3.*?===== -->\n([\s\S]*?)<!-- ===== 4/);
const jsMatch = enhancements.match(/\/\/ ===== 4.*?===== \n([\s\S]*?)console\.log/);

if (!cssMatch || !htmlMatch || !modalMatch || !jsMatch) {
  console.error('无法解析增强代码');
  process.exit(1);
}

const cssCode = cssMatch[1];
const htmlCode = htmlMatch[1];
const modalCode = modalMatch[1];
const jsCode = jsMatch[1];

// 1. 在 </style> 前添加 CSS
indexHtml = indexHtml.replace('</style>', cssCode + '</style>');

// 2. 在 engagement select 后添加操作按钮
indexHtml = indexHtml.replace(
  /(<\/select>\s*<\/div>\s*<div>\s*<input id="search")/,
  '</select></div>\n' + htmlCode + '\n<div><input id="search"'
);

// 3. 在 </main> 后添加模态框
indexHtml = indexHtml.replace('</main>', '</main>\n' + modalCode);

// 4. 在 JavaScript 末尾添加函数
indexHtml = indexHtml.replace(/}\);?\s*<\/script>/, jsCode + '\n});\n</script>');

// 保存文件
fs.writeFileSync(indexPath, indexHtml, 'utf8');

console.log('✅ Web UI 增强功能已成功集成！');
console.log('📍 修改的文件: packages/webui/src/index.html');
console.log('🔧 请重新构建并启动服务: pnpm -C apps/cli build && pnpm openfde serve');