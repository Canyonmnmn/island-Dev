import cac from 'cac';
import { createDevServer } from './dev';
import { build } from './build';
import { resolve } from 'path';

const cli = cac('island').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').action(async (root) => {
  console.log('dev', root);
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli.command('build [root]', 'build in pro').action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (error) {
    console.log(error);
  }
});

cli.parse();
