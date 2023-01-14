import Image from "next/image";
import React from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";

type Props = {};

const Hero = (props: Props) => {
  const [text, count] = useTypewriter({
    words: [
      "Hi, I am Murat Hüdavendigâr",
      "Frontend Developer",
      "React Developer",
    ],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden">
      <BackgroundCircles />
      <Image
        src="https://pbs.twimg.com/profile_images/1589564512599932929/JuGsRJNz_400x400.jpg"
        alt="photos"
        className="relative rounded-full object-cover"
        width={128}
        height={128}
        loading="lazy"
      />
      <h1>
        <span>{text}</span>
        <Cursor cursorColor="#f7ab0a" />
      </h1>
    </div>
  );
};

export default Hero;
