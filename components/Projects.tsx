import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
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
