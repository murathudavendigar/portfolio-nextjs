import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {};

const ExperienceCard = (props: Props) => {
  return (
    <article className="flex flex-col rounded-lg items-center space-y-7 mt-8 flex-shrink-0 w-[500px] h-[500px] sm:w-[500px] sm:h-[600px] md:w-[600px] md:h-[600px] xl:w-[900px] xl:h-[] snap-center bg-[#525252] p-10 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-hidden ">
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
        className="w-32 h-32 rounded-full xl:w-[200px] xl:h-[200px] object-cover object-center"
        src="https://pbs.twimg.com/profile_images/1589564512599932929/JuGsRJNz_400x400.jpg"
        alt=""
      />

      <div className="px-0 md:px-10">
        <h4 className="text-4xl font-light">header</h4>
        <p className="font-bold text-2xl mt-1">company</p>
        <div className="flex space-x-2 my-2">
          <Image
            src="https://www.citypng.com/public/uploads/preview/js-javascript-round-logo-icon-png-11662226392lsrrajcm0y.png"
            alt=""
            className="rounded-full"
            width={40}
            height={40}
            loading="lazy"
          />
          <Image
            src="https://www.citypng.com/public/uploads/preview/download-html5-round-logo-icon-png-116622246089xqzopcuvg.png"
            alt=""
            className="rounded-full"
            width={40}
            height={40}
            loading="lazy"
          />
          <Image
            src="https://www.citypng.com/public/uploads/preview/hd-css3-round-logo-icon-transparent-png-11662224253zt2ubozvzc.png"
            alt=""
            className="rounded-full"
            width={40}
            height={40}
            loading="lazy"
          />
        </div>
        <p className="uppercase py-5 text-gray-300">
          started work.... - ended...
        </p>
        <ul className="list-disc space-y-4 ml-5 text-lg">
          <li>points</li>
          <li>points</li>
          <li>points</li>
          <li>points</li>
          <li>points</li>
        </ul>
      </div>
    </article>
  );
};

export default ExperienceCard;
