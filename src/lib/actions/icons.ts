"use server";

import { readdirSync } from "fs";
import { join } from "path";

export type IconInfo = {
  name: string;
  path: string;
};

export async function listIconsAction(): Promise<IconInfo[]> {
  const iconsDir = join(process.cwd(), "public", "imgs", "icons", "links");
  const files = readdirSync(iconsDir);
  return files
    .filter((f) => f.endsWith(".png"))
    .map((f) => ({
      name: f.replace(/\.png$/i, ""),
      path: `/imgs/icons/links/${f}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
