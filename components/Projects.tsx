import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import { getTemcraftClients } from "@/data/temcraftClients";
import { temcraftUrl } from "@/lib/site";
import { getRatingsBySlug } from "@/lib/appStore";
import { getEarlierProjects, getSelectedProjectsByCategory } from "@/lib/projects";

const Projects = async () => {
  const groups = getSelectedProjectsByCategory();
  const earlier = getEarlierProjects();
  const ratings = await getRatingsBySlug(groups.flatMap((g) => g.projects));

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <Reveal>
        <p className="font-mono-ui text-center text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Work
        </p>
        <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
          Things I&apos;ve built and shipped
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          Apps, web products, and developer tools that are live today — each
          with a short case study. Older and smaller builds are at the bottom.
        </p>
      </Reveal>

      {groups.map((group, groupIndex) => (
        <Reveal key={group.category} delay={0.04 * Math.min(groupIndex, 3)}>
          <section className="mt-16">
            <h2 className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {group.category}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.projects.map((project) => (
                <WorkCard
                  key={project.slug}
                  project={project}
                  rating={ratings[project.slug]}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ))}

      <Reveal>
        <section className="mt-24" aria-labelledby="temcraft-clients">
          <h2
            id="temcraft-clients"
            className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Client sites with TemCraft Tech
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
            German client sites from{" "}
            <a
              href={temcraftUrl}
              target="_blank"
              rel="noopener"
              className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-[var(--accent-text)] dark:decoration-gray-400">
              TemCraft Tech
            </a>
            , the studio I co-founded. More client work is on its{" "}
            <a
              href={`${temcraftUrl}/en/references`}
              target="_blank"
              rel="noopener"
              className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-[var(--accent-text)] dark:decoration-gray-400">
              projects page
            </a>
            .
          </p>
          <ul className="mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {getTemcraftClients().map((client) => (
              <li key={client.url}>
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex h-full flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#CA3E47]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:border-gray-300 dark:bg-gray-200/30">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
                      {client.sector}
                    </span>
                    {client.contributed ? (
                      <span className="font-mono-ui shrink-0 rounded-full border border-[#CA3E47]/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--accent-text)]">
                        I worked on this
                      </span>
                    ) : null}
                  </span>
                  <span className="text-sm font-semibold transition-colors group-hover:text-[var(--accent-text)] dark:text-gray-900">
                    {client.name}
                  </span>
                  <span className="font-mono-ui text-[11px] text-[var(--text-muted)]">
                    {new URL(client.url).hostname.replace(/^www\./, "")}
                    {client.stack ? ` · ${client.stack}` : null}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-24">
          <h2 className="font-mono-ui text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Earlier builds
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
            Smaller and older projects — teaching tools and early apps, each
            built to solve a real problem.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {earlier.map((project) => (
              <WorkCard key={project.slug} project={project} compact />
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
};

export default Projects;
