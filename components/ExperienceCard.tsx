import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Experience } from "@/types";
import { formatExperienceDates } from "@/functions/formatExperienceDates";

type Props = {
  experience: Experience;
};

const ExperienceCard = ({ experience }: Props) => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 mt-8 flex-shrink-0 w-[300px] h-[500px] sm:w-[500px] sm:h-[600px] md:w-[600px] md:h-[600px] xl:w-[900px] xl:h-[] snap-center bg-[#525252]  p-10 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-hidden ">
      <motion.img
        initial={{
          y: -100,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="h-24 w-24 md:w-32 md:h-32 rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
        src={experience.companyImage}
        alt=""
      />

      <div className="px-0 md:px-10">
        <h4 className="text-2xl md:text-4xl font-light text-gray-300">
          {experience.title}
        </h4>
        <p className="font-bold text-xl md:text-2xl mt-1 text-gray-300">
          {experience.company}
        </p>
        <div className="flex space-x-2 my-2">
          {experience.usedTechnologiesImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              className="rounded-full w-8 h-8 md:w-10 md:h-10"
              width={40}
              height={40}
              loading="lazy"
            />
          ))}
        </div>
        <p className="uppercase py-5 text-gray-300">
          {formatExperienceDates(experience.startDate, experience.endDate)}
        </p>
        <ul className="list-disc space-y-4 h-28 md:h-40 mb-10 md:mb-5 ml-5 pr-3 text-xs md:text-lg overflow-y-auto scrollbar-thin scrollbar-thumb-[#CA3E47] scrollbar-track-gray-400/20 text-gray-300">
          {experience.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ExperienceCard;
