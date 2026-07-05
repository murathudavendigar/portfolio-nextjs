import { absoluteUrl, site } from "@/lib/site";
import Head from "next/head";

type SeoProps = {
  title?: string;
  description?: string;
  /** Route path starting with "/", used for the canonical URL. */
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export default function Seo({
  title = site.title,
  description = site.description,
  path = "/",
  image = site.defaultOgImage,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: SeoProps) {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.shortName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" &&
        tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
