import path from 'path';
import fs from 'fs-extra';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types';

type RawConfig =
    | UserConfig
    | Promise<UserConfig>
    | (() => UserConfig | Promise<UserConfig>);
// 根据文件路径读取文件内容
export async function resolveConfig(
    root: string,
    command: 'build' | 'serve',
    mode: 'development' | 'production'
) {
    // 获取文件路径
    const configPath = await getUserConfigPath(root);
    const result = await loadConfigFromFile(
        {
            command,
            mode
        },
        root,
        configPath
    );
    if (result) {
        // result有3中情况 function object promise
        const { config: rawConfig = {} as RawConfig } = result;
        const userConfig =
            typeof rawConfig === 'function' ? await rawConfig() : rawConfig;
        return [configPath, userConfig] as const;
    } else {
        return [configPath, {} as UserConfig] as const;
    }
}

// 读取文件路径
export async function getUserConfigPath(root: string) {
    try {
        const supportConfigFiles = ['config.ts', 'config.js'];
        const cofigPath = supportConfigFiles
            .map((file) => path.resolve(root, file))
            .find(fs.pathExistsSync);
        return cofigPath;
    } catch (e) {
        console.error(`Failed to load user config: ${e}`);
        throw e;
    }
}
