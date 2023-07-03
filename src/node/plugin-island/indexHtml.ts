import { Plugin } from 'vite';
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_ROOT } from '../constants';
import { readFile } from 'fs/promises';

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 1.读取到template.html文件内容
          let content = await readFile(DEFAULT_TEMPLATE_ROOT, 'utf-8');
          // 热更新
          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          // 2.响应html浏览器
          res.setHeader('Content-Type', 'text/html');
          res.end(content);
        });
      };
    }
  };
}
