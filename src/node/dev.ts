import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import PluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';

export async function createDevServer(root) {
    const config = await resolveConfig(root, 'serve', 'development');
    console.log(config, 'asdasd');
    return createServer({
        root,
        plugins: [pluginIndexHtml(), PluginReact()]
    });
}
