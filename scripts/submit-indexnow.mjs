// Pings IndexNow (Bing, Yandex, Seznam, Naver, Yep) about changed URLs.
// Usage:
//   npm run indexnow                          -> every URL in the live sitemap
//   npm run indexnow -- /writing/my-post /now -> only these paths
// Run it after the deploy is live, not before.
const KEY = "e652f460f0874aa1a935ff460744260e";
const HOST = "muratoncu.com";

async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function toUrl(arg) {
  if (arg.startsWith("http")) return arg;
  return `https://${HOST}${arg.startsWith("/") ? "" : "/"}${arg}`;
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length ? args.map(toUrl) : await sitemapUrls();
  if (urls.length === 0) throw new Error("No URLs to submit");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200 = accepted, 202 = accepted, key check pending.
  console.log(`IndexNow submit: ${res.status} ${res.statusText} (${urls.length} URLs)`);
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
