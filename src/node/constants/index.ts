import * as path from 'path';

export const PACKAGE_ROOT = path.join(__dirname, '..');
export const RUNTIME_PATH = path.join(PACKAGE_ROOT, 'src', 'runtime');

export const CLIENT_ENTRY_PATH = path.join(RUNTIME_PATH, 'client-entry.tsx');
export const SERVER_ENTRY_PATH = path.join(RUNTIME_PATH, 'ssr-entry.tsx');
export const DEFAULT_TEMPLATE_ROOT = path.join(PACKAGE_ROOT, 'template.html');
