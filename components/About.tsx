import React from "react";
import { motion } from "framer-motion";

type Props = {};

const About = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 dark:text-gray-700 text-2xl ">
        About
      </h3>
      <motion.img
        initial={{
          x: -200,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        src="https://avatars.githubusercontent.com/u/109613328?v=4"
        alt=""
        className="-mb-20 md:mb-0 flex-shrink-0 w-48 h-48 rounded-full object-cover md:rounded-lg md:h-96 md:w-96 2xl:w-[500px] 2xl:h-[500px]"
        loading="lazy"
      />

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold dark:text-gray-900">
          Hi, I am Murat Hüdavendigâr
        </h4>
        <p className="text-sm">
          I graduated from a Full Stack Developer Bootcamp in Virginia, USA, and
          I am currently a senior Computer Engineering student at Kocaeli
          University. I have over 3 years of experience in Web Development and
          IT. I worked as a Backend Developer and have been working as a
          Frontend Instructor since February 2024.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
