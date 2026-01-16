/**
 * 页面布局组件：负责整体结构渲染，适配手机/电脑端
 * 原生JS实现（若用Vue/React，可对应调整为组件语法）
 */
export function renderLayout() {
  // 1. 创建根容器（适配所有屏幕）
  const rootContainer = document.createElement("div");
  rootContainer.id = "app-root";
  rootContainer.className = "app-container";

  // 2. 创建头部（标题/搜索）
  const header = document.createElement("header");
  header.className = "app-header";
  header.innerHTML = `
    <h1 class="app-title">音乐播放器</h1>
    <div class="search-box">
      <input type="text" id="song-search" placeholder="输入歌曲ID/名称搜索" />
      <button onclick="searchSong()">搜索</button>
    </div>
  `;

  // 3. 创建主体（歌曲列表+播放器）
  const main = document.createElement("main");
  main.className = "app-main";
  main.innerHTML = `
    <div class="song-list-container">
      <h2>歌曲列表</h2>
      <ul id="song-list" class="song-list"></ul>
    </div>
    <div class="player-container">
      <!-- 音频播放器核心DOM（必须有id="audio-player"） -->
      <audio id="audio-player" controls></audio>
      <div class="player-controls">
        <button onclick="prevSong()">上一首</button>
        <button onclick="playOrPause()">播放/暂停</button>
        <button onclick="nextSong()">下一首</button>
        <!-- 可选：手动切换音源按钮 -->
        <select id="source-select" onchange="switchSource(this.value)">
          ${musicSources.map((item, index) => `<option value="${index}">${item.name}</option>`).join("")}
        </select>
      </div>
    </div>
  `;

  // 4. 创建底部（版权信息）
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.innerText = "音乐播放器 © 2024";

  // 5. 组装布局
  rootContainer.appendChild(header);
  rootContainer.appendChild(main);
  rootContainer.appendChild(footer);

  // 6. 挂载到页面body（清空原有内容）
  document.body.innerHTML = "";
  document.body.appendChild(rootContainer);

  // 7. 绑定全局方法（供页面按钮调用）
  window.playMusic = playMusic; // 导入自player.js
  window.switchSource = switchSource; // 导入自player.js
}

// 初始化布局（页面加载时执行）
window.onload = () => {
  renderLayout();
};

// 辅助方法：播放/暂停（示例）
function playOrPause() {
  const audio = document.getElementById("audio-player");
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// 辅助方法：上一首/下一首（示例）
function prevSong() { /* 自行补充逻辑 */ }
function nextSong() { /* 自行补充逻辑 */ }
function searchSong() { /* 自行补充逻辑 */ }
