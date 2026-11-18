#!/usr/bin/env node
/**
 * Next.js only serves files under /public. The content bundle keeps its assets
 * next to the JSON so the content folder stays portable, so copy them to
 * public/assets before dev/build. The copied directory is git-ignored.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "content", "assets");
const destination = join(root, "public", "assets");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

console.log("synced content/assets -> public/assets");
