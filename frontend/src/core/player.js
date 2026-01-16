import { musicSources } from "../config/sources.js";
import { fetchMusicUrl } from "../utils/fetchSource.js";

// 记录当前使用的音源索引（初始为0）
let currentSourceIndex = 0;
// 获取音频播放器实例
const audio = document.getElementById("audio-player");

// 监听「播放失败」事件：失败后自动切换下一个音源
audio.addEventListener("error", async (e) => {
  console.error("播放失败，切换音源：", e);
  // 循环切换（到最后一个则回到第一个）
  currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
  // 重新播放当前歌曲
  const currentSongId = audio.dataset.songId; // 把歌曲ID存在音频标签的自定义属性里
  if (currentSongId) await playMusicWithAutoSwitch(currentSongId);
});

// 带自动切换的播放函数（核心）
export async function playMusicWithAutoSwitch(songId) {
  try {
    const currentSource = musicSources[currentSourceIndex];
    let audioUrl;

    // 区分JSON/JS类型音源的处理逻辑
    if (currentSource.type === "json") {
      // JSON接口：用原请求逻辑获取音频地址
      audioUrl = await fetchMusicUrl(songId, currentSource.url);
    } else if (currentSource.type === "js") {
      // JS插件：动态加载远程JS并调用其方法
      audioUrl = await loadJsPlugin(currentSource.url, songId);
    }

    // 设置音频地址和歌曲ID，开始播放
    audio.dataset.songId = songId;
    audio.src = audioUrl;
    await audio.play();
    console.log(`✅ 使用【${currentSource.name}】播放成功`);
  } catch (err) {
    console.error(`❌ 【${musicSources[currentSourceIndex].name}】请求失败`, err);
    // 主动切换音源并重试
    currentSourceIndex = (currentSourceIndex + 1) % musicSources.length;
    await playMusicWithAutoSwitch(songId);
  }
}

// 辅助函数：加载远程JS插件并获取音频地址
async function loadJsPlugin(pluginUrl, songId) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = pluginUrl;
    // JS加载成功后，调用插件暴露的方法（需和插件实际方法匹配）
    script.onload = async () => {
      try {
        // 示例：酷我插件暴露getKuwoUrl，网易云暴露getNeteaseUrl
        const platform = musicSources[currentSourceIndex].platform;
        const audioUrl = await window[`get${platform.charAt(0).toUpperCase() + platform.slice(1)}Url`](songId);
        resolve(audioUrl);
      } catch (err) {
        reject(err);
      }
      document.head.removeChild(script); // 加载完移除脚本
    };
    // JS加载失败
    script.onerror = (err) => {
      reject(err);
      document.head.removeChild(script);
    };
    document.head.appendChild(script);
  });
}
