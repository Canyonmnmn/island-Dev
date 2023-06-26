import { createServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import PluginReact from "@vitejs/plugin-react";

export async function createDevServer(root) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), PluginReact()],
  });
}
