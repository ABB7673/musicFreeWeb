// 导入音源配置
import { musicSources } from "../config/sources.js";

// 全局变量：记录当前使用的音源索引（初始为0）
let currentSourceIndex = 0;
// 获取页面中的音频播放器DOM（需确保页面有id="audio-player"的audio标签）
const audioPlayer = document.getElementById("audio-player");

// ===================== 核心监听：播放失败事件 =====================
audioPlayer.addEventListener("error", async (error) => {
  console.error(`【当前音源播放失败】${musicSources[currentSourceIndex].name}`, error);
  // 1. 切换到下一个音源（循环：6→0）
  currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
  // 2. 获取当前要播放的歌曲ID（需确保播放时把ID存在audio的自定义属性中）
  const currentSongId = audioPlayer.dataset.songId;
  if (!currentSongId) {
    alert("未检测到歌曲ID，无法切换音源");
    return;
  }
  // 3. 用新音源重新播放
  await playMusic(currentSongId);
});

// ===================== 核心方法：播放歌曲（带自动切换） =====================
/**
 * 播放指定ID的歌曲，自动适配当前音源类型
 * @param {string} songId - 歌曲ID（如网易云ID、QQ音乐ID）
 */
export async function playMusic(songId) {
  // 清空之前的播放错误状态
  audioPlayer.error = null;
  // 记录当前播放的歌曲ID（用于失败后重新播放）
  audioPlayer.dataset.songId = songId;

  // 获取当前选中的音源配置
  const currentSource = musicSources[currentSourceIndex];
  let audioUrl = ""; // 最终要播放的音频地址

  try {
    // 区分音源类型：JSON / JS
    if (currentSource.type === "json") {
      // 类型1：JSON接口 → 请求接口获取音频地址
      audioUrl = await fetchJsonSource(songId, currentSource.url);
    } else if (currentSource.type === "js") {
      // 类型2：JS插件 → 动态加载插件并调用方法获取音频地址
      audioUrl = await loadJsPluginAndGetUrl(songId, currentSource);
    }

    // 校验音频地址是否有效
    if (!audioUrl || audioUrl === "") {
      throw new Error("未获取到有效音频地址");
    }

    // 设置音频地址并播放
    audioPlayer.src = audioUrl;
    await audioPlayer.play();
    console.log(`【播放成功】使用音源：${currentSource.name}，音频地址：${audioUrl}`);
  } catch (error) {
    console.error(`【当前音源请求失败】${currentSource.name}`, error);
    // 请求失败也切换音源（比如接口返回空、JS插件加载失败）
    currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
    // 递归重试播放（最多重试7次，避免无限循环）
    if (currentSourceIndex < musicSources.length) {
      await playMusic(songId);
    } else {
      alert("所有音源均播放失败，请检查网络或音源接口");
    }
  }
}

// ===================== 辅助方法：请求JSON类型音源 =====================
/**
 * 请求JSON接口获取音频地址
 * @param {string} songId - 歌曲ID
 * @param {string} sourceUrl - JSON接口地址
 * @returns {Promise<string>} 音频播放地址
 */
async function fetchJsonSource(songId, sourceUrl) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`JSON接口请求失败：${response.status}`);
  }
  const sourceData = await response.json();
  // 通用JSON接口解析逻辑（需根据实际接口返回结构调整！）
  // 若你的JSON接口返回格式不同，仅需修改这里的解析规则
  const songItem = sourceData.find(item => item.id === songId);
  if (!songItem || !songItem.url) {
    throw new Error("JSON接口中未找到该歌曲的播放地址");
  }
  return songItem.url;
}

// ===================== 辅助方法：加载JS插件并获取音频地址 =====================
/**
 * 动态加载远程JS插件，调用插件方法获取音频地址
 * @param {string} songId - 歌曲ID
 * @param {object} source - 音源配置（包含url/platform）
 * @returns {Promise<string>} 音频播放地址
 */
async function loadJsPluginAndGetUrl(songId, source) {
  return new Promise((resolve, reject) => {
    // 1. 创建script标签加载远程JS
    const script = document.createElement("script");
    script.src = source.url;
    script.async = true;

    // 2. JS加载成功：调用插件暴露的方法
    script.onload = async () => {
      try {
        // 插件方法名规则：get+平台名首字母大写+Url（如kuwo→getKuwoUrl）
        const pluginMethodName = `get${source.platform.charAt(0).toUpperCase() + source.platform.slice(1)}Url`;
        // 检查插件是否暴露了该方法
        if (typeof window[pluginMethodName] !== "function") {
          throw new Error(`JS插件未找到方法：${pluginMethodName}`);
        }
        // 调用插件方法获取音频地址
        const audioUrl = await window[pluginMethodName](songId);
        resolve(audioUrl);
      } catch (error) {
        reject(error);
      } finally {
        // 加载完成后移除script标签，避免重复加载
        document.head.removeChild(script);
      }
    };

    // 3. JS加载失败
    script.onerror = (error) => {
      reject(new Error(`JS插件加载失败：${source.url}，错误：${error.message}`));
      document.head.removeChild(script);
    };

    // 4. 插入script标签到页面，开始加载
    document.head.appendChild(script);
  });
}

// ===================== 辅助方法：手动切换音源（可选，供页面按钮调用） =====================
export function switchSource(index) {
  if (index >= 0 && index < musicSources.length) {
    currentSourceIndex = index;
    console.log(`【手动切换音源】${musicSources[currentSourceIndex].name}`);
    // 切换后重新播放当前歌曲
    const currentSongId = audioPlayer.dataset.songId;
    if (currentSongId) playMusic(currentSongId);
  }
}
