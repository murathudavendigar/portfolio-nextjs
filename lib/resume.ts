import { existsSync } from "node:fs";
import { join } from "node:path";

export const RESUME_HREF = "/resume.pdf";

export function publicResumeExists(root = process.cwd()) {
  return existsSync(join(root, "public", "resume.pdf"));
}

export function getResumeHref(exists = publicResumeExists()) {
  return exists ? RESUME_HREF : null;
}
