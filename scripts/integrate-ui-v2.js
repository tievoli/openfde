#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'packages/webui/src/index.html');
const backupPath = path.join(__dirname, 'packages/webui/src/index.html.backup');

// 创建备份
fs.copyFileSync(indexPath, backupPath);

// 读取文件
let html = fs.readFileSync(indexPath, 'utf8');

// 1. 在 </style> 前添加CSS（第469行）
const styleEnd = html.indexOf('</style>');
if (styleEnd === -1) {
  console.error('找不到 </style> 标签');
  process.exit(1);
}

const cssToAdd = `
  /* 操作按钮区域 */
  #action-bar {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 0;
    border-top: 1px solid var(--border-soft);
    margin-top: 8px;
  }
  .action-btn {
    width: 100%; height: 32px; padding: 0 12px;
    border: 1px solid var(--border); border-radius: 6px;
    background: #fff; color: var(--text);
    font-family: var(--font); font-size: 12px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s, border-color 0.15s;
  }
  .action-btn:hover { background: var(--bg-hover); border-color: var(--text); }
  .action-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .action-btn.primary:hover { background: #c94d18; }
  .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
  .modal.show { display: flex; }
  .modal-content { background: var(--bg-panel); border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
  .modal-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-header h3 { margin: 0; font-size: 15px; font-weight: 500; }
  .modal-close { width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; font-size: 20px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; border-radius: 4px; }
  .modal-close:hover { background: var(--bg-hover); }
  .modal-body { padding: 20px; }
  .modal-footer { padding: 12px 20px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 6px; color: var(--text); }
  .form-group input, .form-group textarea, .form-group select { width: 100%; background: #fff; color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 8px 10px; font-size: 13px; font-family: var(--font); outline: none; }
  .form-group textarea { min-height: 100px; resize: vertical; }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--text); box-shadow: 0 0 0 3px var(--border-soft); }
  .progress-bar { width: 100%; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 8px; display: none; }
  .progress-bar.active { display: block; }
  .progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; width: 0%; }
  .file-upload { border: 2px dashed var(--border); border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
  .file-upload:hover, .file-upload.dragover { border-color: var(--accent); background: var(--bg-active); }
`;

html = html.slice(0, styleEnd) + cssToAdd + html.slice(styleEnd);

// 2. 在 engagement select 后添加按钮（约第481行）
html = html.replace(
  '</select>\n  </div>\n\n  <div>\n    <input id="search"',
  `</select>
    <button class="action-btn" onclick="showModal('create-project')" style="margin-top: 4px;">➕ 新建项目</button>
    <button class="action-btn" onclick="showModal('import-material')" style="margin-top: 4px;">📥 导入材料</button>
    <button class="action-btn primary" onclick="showModal('extract')" style="margin-top: 4px;">🔄 提取知识</button>
  </div>

  <div>
    <input id="search"`
);

// 3. 在 </main> 后添加模态框
const mainEnd = html.indexOf('</main>');
if (mainEnd === -1) {
  console.error('找不到 </main> 标签');
  process.exit(1);
}

const modals = `
<!-- 新建项目 -->
<div id="modal-create-project" class="modal">
  <div class="modal-content">
    <div class="modal-header"><h3>新建项目</h3><button class="modal-close" onclick="hideModal('create-project')">×</button></div>
    <div class="modal-body">
      <div class="form-group"><label>项目名称</label><input type="text" id="project-name" placeholder="例如：智慧城市项目" /></div>
    </div>
    <div class="modal-footer"><button class="action-btn" onclick="hideModal('create-project')">取消</button><button class="action-btn primary" onclick="createProject()">创建</button></div>
  </div>
</div>

<!-- 导入材料 -->
<div id="modal-import-material" class="modal">
  <div class="modal-content">
    <div class="modal-header"><h3>导入材料</h3><button class="modal-close" onclick="hideModal('import-material')">×</button></div>
    <div class="modal-body">
      <div class="form-group"><label>材料类型</label><select id="material-kind"><option value="message">访谈记录</option><option value="text">文档</option></select></div>
      <div class="form-group"><label>说话人/作者</label><input type="text" id="material-speaker" placeholder="例如：王总" /></div>
      <div class="form-group"><label>内容</label><textarea id="material-content" placeholder="粘贴或输入文本内容..."></textarea></div>
      <div class="progress-bar" id="import-progress"><div class="progress-fill" id="import-progress-fill"></div></div>
    </div>
    <div class="modal-footer"><button class="action-btn" onclick="hideModal('import-material')">取消</button><button class="action-btn primary" onclick="importMaterial()">导入</button></div>
  </div>
</div>

<!-- 知识提取 -->
<div id="modal-extract" class="modal">
  <div class="modal-content">
    <div class="modal-header"><h3>知识提取</h3><button class="modal-close" onclick="hideModal('extract')">×</button></div>
    <div class="modal-body">
      <div class="form-group"><label>选择模型</label><select id="extract-model"><option value="">默认 (glm-5)</option><option value="qwen3.5-plus">Qwen3.5 Plus</option></select></div>
      <div class="form-group"><label><input type="checkbox" id="extract-mock" /> 使用离线模式（测试）</label></div>
      <div id="extract-status" style="display: none; margin-top: 12px; padding: 12px; background: var(--bg); border-radius: 6px;">
        <div id="extract-status-text" style="font-size: 13px; color: var(--text-muted);"></div>
        <div class="progress-bar active" style="margin-top: 8px;"><div class="progress-fill" id="extract-progress-fill"></div></div>
      </div>
    </div>
    <div class="modal-footer"><button class="action-btn" onclick="hideModal('extract')">取消</button><button class="action-btn primary" id="extract-btn" onclick="startExtraction()">开始提取</button></div>
  </div>
</div>

<!-- 创建任务 -->
<div id="modal-create-task" class="modal">
  <div class="modal-content">
    <div class="modal-header"><h3>创建任务</h3><button class="modal-close" onclick="hideModal('create-task')">×</button></div>
    <div class="modal-body">
      <div class="form-group"><label>任务标题</label><input type="text" id="task-title" placeholder="例如：自动化数据清洗" /></div>
      <div class="form-group"><label>验收标准</label><input type="text" id="task-criteria" placeholder="例如：无人值守运行" /></div>
    </div>
    <div class="modal-footer"><button class="action-btn" onclick="hideModal('create-task')">取消</button><button class="action-btn primary" onclick="createTask()">创建</button></div>
  </div>
</div>

<!-- 记录知识 -->
<div id="modal-remember-fact" class="modal">
  <div class="modal-content">
    <div class="modal-header"><h3>记录知识</h3><button class="modal-close" onclick="hideModal('remember-fact')">×</button></div>
    <div class="modal-body">
      <div class="form-group"><label>知识内容</label><textarea id="fact-statement" placeholder="例如：张工程师是数据库管理员"></textarea></div>
      <div class="form-group"><label>来源</label><input type="text" id="fact-source" placeholder="例如：meeting://2024-01-15技术讨论" /></div>
    </div>
    <div class="modal-footer"><button class="action-btn" onclick="hideModal('remember-fact')">取消</button><button class="action-btn primary" onclick="rememberFact()">记录</button></div>
  </div>
</div>
`;

html = html.slice(0, mainEnd + 7) + modals + html.slice(mainEnd + 7);

// 4. 在 JavaScript 末尾添加函数（在最后的 </script> 前）
const scriptEnd = html.lastIndexOf('</script>');
if (scriptEnd === -1) {
  console.error('找不到 </script> 标签');
  process.exit(1);
}

const jsFunctions = `
// 模态框管理
function showModal(id) { document.getElementById('modal-' + id).classList.add('show'); }
function hideModal(id) { document.getElementById('modal-' + id).classList.remove('show'); }

// 创建项目
async function createProject() {
  const name = document.getElementById('project-name').value.trim();
  if (!name) { alert('请输入项目名称'); return; }
  try {
    const res = await api('/api/engagement/create', { name });
    alert('项目 "' + res.slug + '" 创建成功！');
    hideModal('create-project');
    document.getElementById('project-name').value = '';
    await loadEngagements();
  } catch (error) { alert('创建失败：' + error.message); }
}

// 导入材料
async function importMaterial() {
  const kind = document.getElementById('material-kind').value;
  const speaker = document.getElementById('material-speaker').value.trim() || undefined;
  const content = document.getElementById('material-content').value.trim();
  if (!content) { alert('请输入内容'); return; }

  const progressBar = document.getElementById('import-progress');
  const progressFill = document.getElementById('import-progress-fill');
  progressBar.classList.add('active');
  progressFill.style.width = '30%';

  try {
    const res = await api('/api/ingest', { content, kind, speaker, sourceUri: 'web-ui://' + Date.now() });
    progressFill.style.width = '100%';
    setTimeout(() => { progressBar.classList.remove('active'); progressFill.style.width = '0%'; }, 500);
    alert('成功导入 ' + res.episodes + ' 个片段！');
    hideModal('import-material');
    document.getElementById('material-content').value = '';
    document.getElementById('material-speaker').value = '';
    await refresh();
  } catch (error) {
    progressBar.classList.remove('active');
    alert('导入失败：' + error.message);
  }
}

// 知识提取
async function startExtraction() {
  const model = document.getElementById('extract-model').value || undefined;
  const mock = document.getElementById('extract-mock').checked;
  const statusDiv = document.getElementById('extract-status');
  const statusText = document.getElementById('extract-status-text');
  const progressFill = document.getElementById('extract-progress-fill');
  const btn = document.getElementById('extract-btn');

  statusDiv.style.display = 'block';
  statusText.textContent = '正在提取知识...';
  progressFill.style.width = '20%';
  btn.disabled = true;

  try {
    const res = await api('/api/extract', { model, mock });
    progressFill.style.width = '100%';
    statusText.textContent = '提取完成！新增 ' + (res.facts?.ADD || 0) + ' 条知识';
    setTimeout(() => { statusDiv.style.display = 'none'; btn.disabled = false; hideModal('extract'); refresh(); }, 1500);
  } catch (error) {
    statusText.textContent = '提取失败：' + error.message;
    progressFill.style.width = '0%';
    btn.disabled = false;
  }
}

// 创建任务
async function createTask() {
  const title = document.getElementById('task-title').value.trim();
  const criteria = document.getElementById('task-criteria').value.trim() || undefined;
  if (!title) { alert('请输入任务标题'); return; }
  try {
    const res = await api('/api/task/create', { title, criteria });
    alert('任务创建成功！ID: ' + res.taskId);
    hideModal('create-task');
    document.getElementById('task-title').value = '';
    document.getElementById('task-criteria').value = '';
    await refresh();
  } catch (error) { alert('创建失败：' + error.message); }
}

// 记录知识
async function rememberFact() {
  const statement = document.getElementById('fact-statement').value.trim();
  const sourceUri = document.getElementById('fact-source').value.trim();
  if (!statement || !sourceUri) { alert('请填写完整信息'); return; }
  try {
    const res = await api('/api/remember', { statement, sourceUri });
    alert('知识记录成功！');
    hideModal('remember-fact');
    document.getElementById('fact-statement').value = '';
    document.getElementById('fact-source').value = '';
    await refresh();
  } catch (error) { alert('记录失败：' + error.message); }
}

`;

html = html.slice(0, scriptEnd) + jsFunctions + html.slice(scriptEnd);

// 保存文件
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✅ Web UI 增强功能已成功集成！');
console.log('📍 备份文件: packages/webui/src/index.html.backup');
console.log('🚀 请运行: pnpm -C apps/cli build && pnpm openfde serve');