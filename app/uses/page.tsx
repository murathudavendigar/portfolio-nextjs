import { USES_CATEGORIES } from "@/data/usesData";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Uses",
  description: "The hardware and software Murat Hüdavendigâr Öncü uses on a daily basis.",
};

export default function UsesPage() {
  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main" className="max-w-4xl mx-auto px-6 py-20 sm:py-32">
        <Reveal>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
            /uses
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
            What I use
          </h1>
          <p className="mt-6 text-base leading-relaxed text-gray-300 dark:text-gray-700">
            A somewhat comprehensive list of the tools, apps, and hardware I use to build frontend products and teach.
          </p>
        </Reveal>

        <div className="mt-16 space-y-20">
          {USES_CATEGORIES.map((category, index) => (
            <Reveal key={category.name} delay={index * 0.1}>
              <section>
                <h2 className="text-xl font-semibold dark:text-gray-900 border-b border-white/10 dark:border-gray-400/40 pb-4 mb-6">
                  {category.name}
                </h2>
                <ul className="space-y-6">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <span className="font-medium text-white dark:text-gray-900 sm:w-1/3 shrink-0">
                        {item.name}
                      </span>
                      <span className="text-gray-400 dark:text-gray-600">
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}
