import React from "react";
import { motion } from "framer-motion";

type Props = {
  directionLeft?: boolean;
  item: {
    name: string;
    img: string;
  };
};

const Skill = ({ directionLeft, item }: Props) => {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.img
        initial={{
          x: directionLeft ? -200 : 200,
          opacity: 0,
        }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, x: 0 }}
        src={item.img}
        loading="lazy"
        className=" object-cover w-12 h-12 sm:w-20 sm:h-20 md:w-26 md:h-26 xl:w-30 xl:h-30 filter group-hover:grayscale transition duration-300 "
      />
      <motion.div
        initial={{
          x: directionLeft ? -200 : 200,
        }}
        transition={{ duration: 1 }}
        whileInView={{ x: 0 }}
        className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group hover:bg-[#313131]/70 dark:hover:bg-[#bcc]/70  w-12 h-12 sm:h-20 sm:w-20 md:w-26 md:h-26 xl:w-30 xl:h-30 z-0">
        <div className="flex items-center justify-center h-full">
          <p className="text-lg font-bold text-[#fff] dark:text-black opacity-100">
            {item.name}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Skill;
