import { getResumeHref } from "@/lib/resume";
import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  const resumeHref = getResumeHref();
  const facts = [
    { label: "Based in", value: "Netherlands" },
    {
      label: "Company",
      value: "TemCraft Tech",
      href: "https://temcrafttech.com",
    },
    { label: "Also", value: "Frontend instructor" },
    { label: "Builds with", value: "React, Next.js, TypeScript, React Native" },
    { label: "Also uses", value: "Django, .NET when a product needs it" },
    ...(resumeHref
      ? [{ label: "Résumé", value: "PDF", href: resumeHref }]
      : []),
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[#CA3E47]">
        About
      </p>
      <div className="mt-6 grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Image
          src={site.profileImage}
          alt="Murat Hüdavendigâr Öncü"
          width={640}
          height={800}
          priority
          className="h-auto w-full max-w-sm rounded-lg object-cover object-top sm:max-w-md"
        />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
            I ship frontend products and teach the same craft.
          </h1>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
            <p>
              Murat Hüdavendigâr Öncü is a frontend developer, co-founder of{" "}
              <a
                href="https://temcrafttech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
                TemCraft Tech
              </a>
              , and a frontend instructor based in the Netherlands. I ship
              React, Next.js, and iOS products and teach the same stack in
              class.
            </p>
            <p>
              The through-line is products people can actually use: Daily
              Skyline and Courai on the App Store, npm tools I use with
              students, and client work in React and Next.js. React Native
              joined that list when I started shipping iOS myself. I studied
              Computer Engineering at Kocaeli University.
            </p>
            <p>
              Open to roles, scoped freelance, and teaching. If you need
              someone who can own the frontend and explain the decisions,{" "}
              <Link
                href="/contact"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
                write to me
              </Link>
              .
            </p>
          </div>

          <dl className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 dark:border-gray-400/40">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm dark:text-gray-800">
                  {"href" in fact && fact.href ? (
                    <a
                      href={fact.href}
                      {...(fact.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : { download: true })}
                      className="hover:text-[#CA3E47] transition-colors">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 max-w-2xl space-y-10 lg:ml-auto lg:w-[min(100%,36rem)]">
        <div>
          <h2 className="text-xl font-semibold tracking-tight dark:text-gray-900">
            Who is Murat Öncü?
          </h2>
          <p className="mt-3 text-base leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
            Murat Hüdavendigâr Öncü is a frontend developer, co-founder of
            TemCraft Tech, and a frontend instructor based in the Netherlands.
            He builds production interfaces in React, Next.js, and TypeScript,
            and he ships iOS apps with React Native and Expo — including Daily
            Skyline, a daily 5×5 skyscraper logic puzzle on the App Store, and
            Courai, a CBT-based iOS app for social anxiety. He also publishes
            npm tools he uses while teaching, such as codebrief and Dev Console
            Kit. He studied Computer Engineering at Kocaeli University and
            co-founded TemCraft Tech to take client and product work from scope
            to a live UI. He teaches HTML, CSS, JavaScript, React, and Next.js
            while using the same stack in production. He is open to frontend
            roles in the Netherlands or remote, scoped freelance through
            TemCraft Tech, and teaching. Notes on React, TypeScript, and
            teaching live on this site.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight dark:text-gray-900">
            What does he ship?
          </h2>
          <p className="mt-3 text-base leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
            Selected work includes Daily Skyline and Courai on iOS, plus
            codebrief and Dev Console Kit on npm, and client React / Next.js
            products at TemCraft Tech. Case studies are on the{" "}
            <Link
              href="/work"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
              Work
            </Link>{" "}
            page.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight dark:text-gray-900">
            Where is he based?
          </h2>
          <p className="mt-3 text-base leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
            The Netherlands. Frontend roles, remote product work, and teaching
            are in scope —{" "}
            <Link
              href="/contact"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
              contact
            </Link>{" "}
            is {site.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
