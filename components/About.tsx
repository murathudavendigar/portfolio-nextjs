import React from "react";
import { motion } from "framer-motion";

type Props = {};

const About = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-2-7xl px-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl ">
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
        className="-mb-20 md:mb-0 flex-shrink-0 2-56 h-56 rounded-full object-cover md:rounded-lg md:h-95 md:w-64 xl:w-[500px] xl:h-[600px]"
        loading="lazy"
      />

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold ">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi, esse!
        </h4>
        <p className="text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi,
          itaque ea consectetur dolore accusantium iste rerum necessitatibus
          fuga tenetur exercitationem error quaerat velit possimus, voluptatem
          incidunt? Fuga doloremque similique aliquid amet fugit laudantium,
          maxime quis nihil dolorum impedit, nam nemo debitis vel commodi
          repellendus saepe esse atque tenetur voluptate porro.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
