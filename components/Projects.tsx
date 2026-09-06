import WorkCard from "@/components/WorkCard";
import { getRatingsBySlug } from "@/lib/appStore";
import { getEarlierProjects, getSelectedProjectsByCategory } from "@/lib/projects";

const Projects = async () => {
  const groups = getSelectedProjectsByCategory();
  const earlier = getEarlierProjects();
  const ratings = await getRatingsBySlug(groups.flatMap((g) => g.projects));

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <p className="font-mono-ui text-center text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Work
      </p>
      <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
        Selected work, then earlier builds
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-gray-300 dark:text-gray-700">
        Shipped products and tools first, grouped by kind. Learning clones and
        older experiments stay listed, clearly labeled, underneath.
      </p>

      {groups.map((group) => (
        <section key={group.category} className="mt-16">
          <h2 className="font-mono-ui text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
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
      ))}

      <section className="mt-24">
        <h2 className="font-mono-ui text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
          Earlier builds
        </h2>
        <p className="mt-2 max-w-xl text-sm text-gray-400 dark:text-gray-600">
          Course projects and clones from when I was learning the stack. Kept
          for the record — not the work I lead with.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {earlier.map((project) => (
            <WorkCard key={project.slug} project={project} compact />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
