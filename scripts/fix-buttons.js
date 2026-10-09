#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'packages/webui/src/index.html');
const backupPath = path.join(__dirname, 'packages/webui/src/index.html.backup2');

// 创建备份
fs.copyFileSync(indexPath, backupPath);

// 读取文件
let html = fs.readFileSync(indexPath, 'utf8');

// 找到 engagement select 后面的位置并添加按钮
// 原来的结构是：</select></div><div><input id="search"
// 需要在</select></div>后添加按钮

html = html.replace(
  '</select>\n  </div>\n\n  <div>\n    <input id="search"',
  `</select>
  </div>

  <!-- 操作按钮区域 -->
  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-soft);">
    <button class="action-btn" onclick="showModal('create-project')">➕ 新建项目</button>
    <button class="action-btn" onclick="showModal('import-material')" style="margin-top: 4px;">📥 导入材料</button>
    <button class="action-btn primary" onclick="showModal('extract')" style="margin-top: 4px;">🔄 提取知识</button>
  </div>

  <div>
    <input id="search"`
);

// 保存文件
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✅ 按钮已成功添加到侧边栏！');
console.log('📍 备份文件: packages/webui/src/index.html.backup2');
console.log('🔄 请刷新浏览器页面（Ctrl+F5）');