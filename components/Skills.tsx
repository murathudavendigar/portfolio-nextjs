import { skillGroups, skillsData } from "@/data/skillsData";

const byName = new Map(skillsData.map((skill) => [skill.name, skill]));

export default function Skills() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Skills
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
        The stack I actually ship with
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
        Grouped by how I use it — not a logo wall you have to hover.
      </p>

      <div className="mt-12 space-y-12">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-600">
              {group.label}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.names.map((name) => {
                const skill = byName.get(name);
                return (
                  <li
                    key={name}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 dark:border-gray-400/40 dark:bg-gray-200/30">
                    {skill?.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={skill.img}
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded bg-white/10 font-mono-ui text-[10px] text-[var(--accent-text)] dark:bg-gray-300/60">
                        {name.slice(0, 2)}
                      </span>
                    )}
                    <span className="text-sm dark:text-gray-900">{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
