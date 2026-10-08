import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

export function loadWebBundle(directory: string) {
  const html = readFileSync(join(directory, "index.html"), "utf8");
  const assets = new Map<string, { bytes: Buffer; mime: string }>();
  const types: Record<string, string> = {
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
  };
  function walk(path: string, prefix: string) {
    for (const name of readdirSync(path)) {
      const file = join(path, name);
      if (statSync(file).isDirectory()) walk(file, `${prefix}/${name}`);
      else if (types[extname(name)])
        assets.set(`${prefix}/${name}`, {
          bytes: readFileSync(file),
          mime: types[extname(name)]!,
        });
    }
  }
  walk(join(directory, "assets"), "/assets");
  return {
    html,
    assets,
    csp: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://tile.openstreetmap.org https://*.tile.openstreetmap.org; font-src 'self'; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  };
}
