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
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 text-2xl ">
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
        src="https://pbs.twimg.com/profile_images/1589564512599932929/JuGsRJNz_400x400.jpg"
        alt=""
        className="-mb-20 md:mb-0 flex-shrink-0 w-48 h-48 rounded-full object-cover md:rounded-lg md:h-96 md:w-72 2xl:w-[500px] 2xl:h-[600px]"
        loading="lazy"
      />

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold ">Hi, I am Murat Hüdavendigâr</h4>
        <p className="text-sm">
          I graduated from Full Stack Developer Bootcamp in Virginia, USA and am
          a senior computer engineering student at Kocaeli University. I have 3+
          years of experience in Web Development and IT.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
