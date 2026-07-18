"use client";
import projectsData from "@/data/projects.json";
import type { Projects as ProjectType } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {};

const allProjectsData = projectsData as ProjectType[];

const Projects = (props: Props) => {
  const [showProjects, setShowProjects] = useState<ProjectType[]>(
    allProjectsData.filter((p) => p.featured === true),
  );
  const [lang, setLang] = useState("Featured");

  useEffect(() => {
    if (lang === "Featured") {
      setShowProjects(allProjectsData.filter((project) => project.featured === true));
    } else if (lang === "All") {
      setShowProjects(allProjectsData);
    } else {
      setShowProjects(allProjectsData.filter((project) => project.language === lang));
    }
  }, [lang]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative z-0 flex flex-col items-center h-screen max-w-full mx-auto overflow-hidden text-left md:flex-row justify-evenly">
      <h3 className="absolute top-20 uppercase tracking-[20px] text-gray-200 dark:text-gray-900 text-2xl ">
        Projects
      </h3>
      <div className="absolute z-30 flex flex-wrap justify-center gap-2 px-4 top-32">
        <button
          className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
            lang == "Featured" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("Featured")}>
          Featured
        </button>
        <button
          className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
            lang == "All" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("All")}>
          All Projects
        </button>
        <button
          className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
            lang == "React.JS" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("React.JS")}>
          React.JS
        </button>
        <button
          className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
            lang == "Next.JS" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("Next.JS")}>
          Next.JS
        </button>
        <button
          className={`heroButton px-3 py-1 text-xs md:px-6 md:py-2 md:text-sm ${
            lang == "NPM" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("NPM")}>
          NPM
        </button>
      </div>

      {showProjects.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-300 dark:text-gray-900">
            No projects found
          </div>
        </div>
      ) : (
        <>
          <ArrowLeftIcon className="text-[#CA3E47] h-7 w-7 animate-pulse absolute top-1/2 left-[25px]" />
          <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-200/20 scrollbar-thumb-[#CA3E47]/80">
            {showProjects.map((project, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center flex-shrink-0 w-screen h-screen p-20 space-y-5 snap-center md:p-44">
                <div className="max-w-6xl px-0 space-y-6 md:px-10">
                  {project.img?.trim() ? (
                    <div className="hidden md:flex justify-center">
                      <img
                        src={project.img}
                        alt={project.name}
                        className="w-full max-w-md h-40 object-cover rounded-lg border border-white/10 dark:border-gray-300 shadow-md"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <h4 className="text-xl font-semibold text-center md:text-2xl lg:text-4xl dark:text-gray-900">
                    <span className=" border-b border-[#CA3E47] ">
                      <span>{lang}</span> Study {index + 1} of{" "}
                      {showProjects.length}:{" "}
                    </span>
                    {project.name}
                  </h4>
                  <p className="text-sm text-center md:text-lg md:text-left max-h-32 md:max-h-40 overflow-y-auto leading-relaxed px-4 md:px-0 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/60">
                    {project.description}
                  </p>

                  {/* Technology Badge */}
                  <div className="flex justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 dark:bg-gray-200/50 border border-white/20 dark:border-gray-300 text-gray-200 dark:text-gray-800">
                      {project.language === "NPM" && (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                        </svg>
                      )}
                      {project.language === "React.JS" && (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                        </svg>
                      )}
                      {project.language === "Next.JS" && (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068c-.0625-.0402-.1142-.1038-.1537-.1733l-.0587-.1136.0048-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z" />
                        </svg>
                      )}
                      {project.language}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 dark:bg-gray-200/50 border border-white/10 dark:border-gray-300 hover:bg-[#CA3E47] hover:border-[#CA3E47] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                      <svg
                        className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-200 dark:text-gray-800 group-hover:text-white">
                        GitHub
                      </span>
                    </a>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 bg-white/5 dark:bg-gray-200/50 border-white/10 dark:border-gray-300 hover:bg-[#CA3E47] hover:border-[#CA3E47]`}>
                      {project.language === "NPM" ? (
                        <svg
                          className="w-5 h-5 text-[#CB3837] group-hover:text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor">
                          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm font-medium text-gray-200 dark:text-gray-800 group-hover:text-white`}>
                        {project.language === "NPM"
                          ? "NPM Package"
                          : "Live Demo"}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ArrowRightIcon className="text-[#CA3E47] h-7 w-7 animate-pulse absolute top-1/2 right-[25px]" />
        </>
      )}
      <div className="w-full absolute top-[30%] bg-[#CA3E47]/10 dark:bg-[#ca3e47]/50 left-0 h-[500px] skew-y-12" />
    </motion.div>
  );
};

export default Projects;
