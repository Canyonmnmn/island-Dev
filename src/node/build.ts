import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';

export async function bundle(root: string) {
  try {
    console.log('build client + server');
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          outDir: isServer ? '.temp' : 'build',
          ssr: isServer,
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };
    const clientBuild = () => viteBuild(resolveViteConfig(false));
    const serverBuild = () => viteBuild(resolveViteConfig(true));
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    return [clientBundle, serverBundle];
  } catch (error) {
    console.log(error);
  }
}

export async function build(root: string) {
  // 1.bundle ———— 打包server端、client端
  const [clientBundle, serverBundle] = await bundle(root);
  // 2.引入 server-entry模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  // 3.服务端渲染，产出html
  const { render } = await import(serverEntryPath);
  await renderPage(root, render, clientBundle);
}

export async function renderPage(
  root: string,
  render: () => string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry === true
  );
  const html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/${clientChunk.fileName}" type="module"></script>
  </body>
</html>`.trim();
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  await fs.remove(join(root, '.temp'));
}
