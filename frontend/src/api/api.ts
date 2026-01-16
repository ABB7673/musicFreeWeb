import { MusicPlugin } from './type';

/**
 * [配置区域] 
 * baseURL 是你运行后台服务的地址（例如本地测试通常是 http://localhost:3000）
 */
const baseURL = process.env.API_BASE_URL || '';

/**
 * [插件源列表] 
 * 这是你提供的 7 个音源插件地址
 */
export const PRESET_PLUGIN_SOURCES = [
    "https://musicfreepluginshub.2020818.xyz/plugins.json",
    "https://fastly.jsdelivr.net/gh/Huibq/keep-alive/Music_Free/myPlugins.json",
    "https://gitlab.com/acoolbook/musicfree/-/raw/main/music.json",
    "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/kuwo.js",
    "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/netease.js",
    "https://cdn.jsdelivr.net/gh/maotoumao/MusicFreePlugins@master/qq.js",
    "https://raw.githubusercontent.com/maotoumao/MusicFreePlugins/master/plugins.json"
];

// ----------------------------------------------------------------
// 插件管理相关
// ----------------------------------------------------------------

// 获取已安装的插件列表
export const getPlugins = async (): Promise<MusicPlugin[]> => {
    const res = await fetch(`${baseURL}/plugins`);
    return res.json();
};

/**
 * 安装插件 (核心修改：现在你可以传入上面列表中的任何一个 URL)
 */
export const installPlugins = async (url: string) => {
    const res = await fetch(`${baseURL}/plugins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
    return res.json();
};

/**
 * [新增功能] 一键安装上面所有的 7 个插件源
 * 适合新手第一次初始化使用
 */
export const installAllDefaultPlugins = async () => {
    const results = [];
    for (const url of PRESET_PLUGIN_SOURCES) {
        try {
            const result = await installPlugins(url);
            results.push({ url, status: 'success', data: result });
        } catch (error) {
            results.push({ url, status: 'error', error });
        }
    }
    return results;
};

// 卸载插件
export const uninstallPlugin = async (hash: string) => {
    const res = await fetch(`${baseURL}/plugin/${hash}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
};

// ----------------------------------------------------------------
// 搜索与发现相关
// ----------------------------------------------------------------

export const supportPlugins = async (method: string): Promise<MusicPlugin[]> => {
    const res = await fetch(`${baseURL}/plugins/support/${method}`);
    return res.json();
};

export const searchablePlugins = async (method: string): Promise<MusicPlugin[]> => {
    const res = await fetch(`${baseURL}/plugins/searchable/${method}`);
    return res.json();
};

export const getPluginByHash = async (hash: string): Promise<MusicPlugin> => {
    const res = await fetch(`${baseURL}/plugin/${hash}`);
    return res.json();
};

// ----------------------------------------------------------------
// 榜单、音乐、搜索 API (保持不变，已核对)
// ----------------------------------------------------------------

export const getTopLists = async (hash: string) => {
    const res = await fetch(`${baseURL}/top?hash=${hash}`);
    return res.json();
};

export const getTopListDetail = async (platform: string, item: any, page: number) => {
    const res = await fetch(`${baseURL}/top/detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            page: page.toString(),
            name: platform,
            data: JSON.stringify(item),
        }),
    });
    return res.json();
};

export const getMusicSource = async (musicItem: any, quality: any) => {
    const res = await fetch(`${baseURL}/music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quality,
            data: JSON.stringify(musicItem),
        }),
    });
    return res.json();
};

export const searchMusic = async (hash: string, query: string, page: number, type: string) => {
    const res = await fetch(`${baseURL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query,
            hash,
            page: page.toString(),
            type,
        }),
    });
    return res.json();
};

export const getRecommendSheetTags = async (hash: string) => {
    const res = await fetch(`${baseURL}/recommend/${hash}`);
    return res.json();
};

export const getRecommendSheetByTag = async (hash: string, tag: any, page: number) => {
    const res = await fetch(`${baseURL}/recommend/${hash}/${JSON.stringify(tag)}?page=${page}`);
    return res.json();
};

export const getMusicSheetInfo = async (item: any, page: number) => {
    const res = await fetch(`${baseURL}/music-sheet?item=${JSON.stringify(item)}&page=${page}`);
    return res.json();
};
