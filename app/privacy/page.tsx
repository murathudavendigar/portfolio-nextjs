import { privacyPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

const description =
  "What muratoncu.com collects through the contact form and site analytics, and how it's used.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy Policy — ${site.shortName}`,
    description,
    url: `${site.url}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPageGraph()) }}
      />
      <main id="main" className="w-full py-16 sm:py-20 md:py-24">
        <article className="max-w-3xl px-4 mx-auto prose prose-invert dark:prose sm:px-6 lg:px-8">
          <h1>Privacy Policy</h1>
          <p className="font-mono-ui text-sm text-gray-400 dark:text-gray-600">
            Last updated: September 2026
          </p>

          <p>
            This site is a personal portfolio. It doesn&apos;t run ads, sell
            data, or use third-party trackers beyond what&apos;s described
            below.
          </p>

          <h2>Contact form</h2>
          <p>
            The contact form on <a href="/contact">/contact</a> is handled by{" "}
            <a
              href="https://www.emailjs.com/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer">
              EmailJS
            </a>
            . Whatever you type — name, email, and message — is sent through
            EmailJS directly to {site.email}. It isn&apos;t stored in a
            database on this site, and it&apos;s only used to reply to you.
          </p>

          <h2>Theme preference</h2>
          <p>
            The light/dark toggle saves your choice in your browser&apos;s
            local storage so it persists between visits. This stays on your
            device and is never sent to me.
          </p>

          <h2>Analytics</h2>
          <p>
            Traffic is monitored through Cloudflare (as the DNS/CDN provider
            for this domain) and Google Search Console. Both report
            aggregate, anonymized traffic and search-performance data — they
            don&apos;t identify individual visitors.
          </p>

          <h2>Cookies</h2>
          <p>
            This site doesn&apos;t set marketing or tracking cookies. Any
            cookies you see come from the browser/CDN layer (Cloudflare), not
            from application code here.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about any of this, email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </article>
      </main>
    </div>
  );
}
