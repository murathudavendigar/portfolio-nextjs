import React from "react";
import { motion } from "framer-motion";
import Skill from "./Skill";
import { skillsData } from "../data/skillsData";

type Props = {};

const Skills = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="h-screen flex flex-col relative text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 text-2xl ">
        Skills
      </h3>
      <h3 className="absolute top-[8.5rem] uppercase tracking-[3px] text-gray-200 text-sm">
        Hover over a skill for name
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-10 2xl:grid-cols-4 gap-5 align-middle">
        {skillsData.map((item, index) =>
          index % 2 == 0 ? (
            <Skill key={index} item={item} />
          ) : (
            <Skill key={index} item={item} directionLeft={true} />
          )
        )}
      </div>
    </motion.div>
  );
};

export default Skills;
