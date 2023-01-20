import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projectsData } from "../data/projectsData";
import { Projects } from "@/types";
import { SocialIcon } from "react-social-icons";

type Props = {};

const Projects = (props: Props) => {
  const [showProjects, setShowProjects] = useState<Projects[]>(projectsData);
  const [lang, setLang] = useState("All");

  useEffect(() => {
    if (lang == "All") {
      setShowProjects(projectsData);
    } else if (lang == "React.JS") {
      setShowProjects(
        projectsData.filter((project) => project.language == "React.JS")
      );
    } else if (lang == "Next.JS") {
      setShowProjects(
        projectsData.filter((project) => project.language == "Next.JS")
      );
    }
  }, [lang]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0">
      <h3 className="absolute top-20 uppercase tracking-[20px] text-gray-200 text-2xl ">
        Projects
      </h3>
      <div className="absolute top-32 flex flex-row z-30 ">
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
      <div className="relative w-full flex overflow-x-scroll everflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-200/20 scrollbar-thumb-[#CA3E47]/80">
        {showProjects.map((project, index) => (
          <div
            key={index}
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen">
            <a href={project.url} target="_blank" rel="noreferrer">
              <motion.img
                initial={{ y: -300, opacity: 0 }}
                transition={{ duration: 1.2 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                src={project.img}
                alt={project.name}
                className="hidden xl:inline-block md:max-w-[400px] 2xl:max-w-[700px] mt-28"
              />
            </a>
            <div className="space-y-6 px-0 md:px-10 max-w-6xl">
              <h4 className="text-2xl md:text-4xl font-semibold text-center">
                <span className=" border-b border-[#CA3E47] ">
                  <span>{lang}</span> Study {index + 1} of {showProjects.length}
                  :{" "}
                </span>
                {project.name}
              </h4>
              <p className="text-sm md:text-lg text-center md:text-left">
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
                  <span className="uppercase hidden md:inline-flex text-sm text-gray-300">
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
                  <span className="uppercase hidden md:inline-flex text-sm text-gray-300">
                    Project
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-[#CA3E47]/10 left-0 h-[500px] skew-y-12" />
    </motion.div>
  );
};

export default Projects;
