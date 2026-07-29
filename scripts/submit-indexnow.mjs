const KEY = "e652f460f0874aa1a935ff460744260e";
const HOST = "www.muratoncu.com";

async function main() {
  const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

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

  console.log(`IndexNow submit: ${res.status} ${res.statusText} (${urls.length} URLs)`);
}

main();
