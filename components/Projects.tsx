import React from "react";
import { motion } from "framer-motion";
import { projectsData } from "../data/projectsData";

type Props = {};

const Projects = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 text-2xl ">
        Projects
      </h3>

      <div className="relative w-full flex overflow-x-scroll everflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-200/20 scrollbar-thumb-[#CA3E47]/80">
        {projectsData.map((project, index) => (
          <div
            key={index}
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen">
            <motion.img
              initial={{ y: -300, opacity: 0 }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src={project.img}
              alt={project.name}
              className="xl:w-[700px]"
            />
            <div className="space-y-10 px-0 md:px-10 max-2-6xl">
              <h4 className="text-4xl font-semibold text-center">
                <span className=" border-b border-[#CA3E47] ">
                  Case Study {index + 1} of {projectsData.length}:{" "}
                </span>
                {project.name}
              </h4>
              <p className="text-lg text-center md:text-left">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-[#CA3E47]/10 left-0 h-[500px] skew-y-12" />
    </motion.div>
  );
};

export default Projects;
