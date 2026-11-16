// Builds two PDFs from scripts/resume.html:
//   public/resume.pdf                  served on the site; no phone or city
//   resume-private/Murat-Oncu-CV.pdf   for job applications; gitignored
// Private details come from scripts/resume.private.json (gitignored; see the
// .example file). Uses the local Google Chrome to print.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const source = readFileSync(join(root, "scripts/resume.html"), "utf8");

const keep = (html, drop) =>
  html
    .replace(new RegExp(`<!--${drop}-->[\\s\\S]*?<!--/${drop}-->`, "g"), "")
    .replace(/<!--\/?(public|private)-->/g, "");

function print(html, out) {
  const dir = mkdtempSync(join(tmpdir(), "resume-"));
  const file = join(dir, "resume.html");
  writeFileSync(file, html);
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${out}`,
    `file://${file}`,
  ], { stdio: "ignore" });
  const pages = readFileSync(out, "latin1").match(/\/Count (\d+)/)?.[1];
  console.log(`${out}: ${pages} page(s)`);
}

print(keep(source, "private"), join(root, "public/resume.pdf"));

const secrets = join(root, "scripts/resume.private.json");
if (existsSync(secrets)) {
  const data = JSON.parse(readFileSync(secrets, "utf8"));
  const html = keep(source, "public").replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
  mkdirSync(join(root, "resume-private"), { recursive: true });
  print(html, join(root, "resume-private/Murat-Oncu-CV.pdf"));
} else {
  console.log("scripts/resume.private.json missing; skipped the private copy.");
}
