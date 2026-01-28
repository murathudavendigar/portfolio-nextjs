import type { Projects as ProjectType } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

type Props = {};

const Projects = (props: Props) => {
  const [showProjects, setShowProjects] = useState<ProjectType[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [lang, setLang] = useState("Featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MongoDB'den projeleri çek
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        const result = await response.json();

        if (result.success) {
          setAllProjects(result.data);
          setShowProjects(result.data);
        } else {
          setError(result.message || "Projeler yüklenemedi");
        }
      } catch (err) {
        setError("Projeler yüklenirken bir hata oluştu");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Dil filtreleme
  useEffect(() => {
    if (lang === "Featured") {
      setShowProjects(
        allProjects.filter((project) => project.featured === true),
      );
    } else if (lang === "All") {
      setShowProjects(allProjects);
    } else {
      setShowProjects(
        allProjects.filter((project) => project.language === lang),
      );
    }
  }, [lang, allProjects]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative z-0 flex flex-col items-center h-screen max-w-full mx-auto overflow-hidden text-left md:flex-row justify-evenly">
      <h3 className="absolute top-20 uppercase tracking-[20px] text-gray-200 dark:text-gray-900 text-2xl ">
        Projects
      </h3>
      <div className="absolute z-30 flex flex-row top-32 ">
        <button
          className={`heroButton px-4 py-1 md:px-6 md:py-2 ${
            lang == "Featured" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("Featured")}>
          Featured
        </button>
        <button
          className={`heroButton px-4 py-1 md:px-6 md:py-2 ${
            lang == "All" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("All")}>
          All Projects
        </button>
        <button
          className={`heroButton px-4 py-1 md:px-6 md:py-2 ${
            lang == "React.JS" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("React.JS")}>
          React.JS
        </button>
        <button
          className={`heroButton px-4 py-1 md:px-6 md:py-2 ${
            lang == "Next.JS" && "text-[#CA3E47] border-[#CA3E47]/40"
          }`}
          onClick={() => setLang("Next.JS")}>
          Next.JS
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-300 dark:text-gray-900">
            Loading...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-red-500">{error}</div>
        </div>
      ) : showProjects.length === 0 ? (
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
                  <h4 className="text-xl font-semibold text-center md:text-2xl lg:text-4xl dark:text-gray-900">
                    <span className=" border-b border-[#CA3E47] ">
                      <span>{lang}</span> Study {index + 1} of{" "}
                      {showProjects.length}:{" "}
                    </span>
                    {project.name}
                  </h4>
                  <p className="text-sm text-center md:text-lg md:text-left">
                    {project.description}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:bg-[#CA3E47] px-4 transition-all duration-200 rounded-md">
                      <SocialIcon
                        url={project.github}
                        fgColor="gray"
                        bgColor="transparent"
                      />
                      <span className="hidden text-sm text-gray-300 uppercase md:inline-flex dark:text-gray-900">
                        GitHub
                      </span>
                    </a>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:bg-[#CA3E47] px-4 transition-all duration-200 rounded-md">
                      <SocialIcon
                        url={project.url}
                        fgColor="gray"
                        bgColor="transparent"
                      />{" "}
                      <span className="hidden text-sm text-gray-300 uppercase md:inline-flex dark:text-gray-900">
                        Project
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
