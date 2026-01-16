/**
 * 音乐音源配置文件
 * type: json/js - 区分接口类型（json为配置接口，js为插件接口）
 * platform: 平台标记 - 方便JS插件加载时匹配方法
 * name: 音源名称 - 便于调试/日志识别
 */
export const musicSources = [
  // 音源1：JSON类型通用接口
  {
    name: "通用音源1",
    url: "https://musicfreepluginshub.2020818.xyz/plugins.json",
    type: "json",
    platform: "general"
  },
  // 音源2：JSON类型通用接口
  {
    name: "通用音源2",
    url: "https://fastly.jsdelivr.net/gh/Huibq/keep-alive/Music_Free/myPlugins.json",
    type: "json",
    platform: "general"
  },
  // 音源3：JSON类型通用接口
  {
    name: "通用音源3",
    url: "https://gitlab.com/acoolbook/musicfree/-/raw/main/music.json",
    type: "json",
    platform: "general"
  },
  // 音源4：JS类型酷我插件接口
  {
    name: "酷我音源",
    url: "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/kuwo.js",
    type: "js",
    platform: "kuwo"
  },
  // 音源5：JS类型网易云插件接口
  {
    name: "网易云音源",
    url: "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/netease.js",
    type: "js",
    platform: "netease"
  },
  // 音源6：JS类型QQ音乐插件接口
  {
    name: "QQ音乐音源",
    url: "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/qq.js",
    type: "js",
    platform: "qq"
  },
  // 音源7：JSON类型通用接口
  {
    name: "通用音源7",
    url: "https://raw.githubusercontent.com/maotoumao/MusicFreePlugins/master/plugins.json",
    type: "json",
    platform: "general"
  }
];

// 辅助函数：获取所有可用音源（备用）
export const getAllSources = () => [...musicSources];
