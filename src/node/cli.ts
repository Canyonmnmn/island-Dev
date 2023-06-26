import cac from "cac";
import { createDevServer } from "./dev";
import { build } from "./build";

const cli = cac("island").version("0.0.1").help();

cli.command("dev [root]", "start dev server").action(async (root) => {
  console.log("dev", root);
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});

cli.command("build [root]", "build in pro").action(async (root) => {
  await build(root);
});

cli.parse();
