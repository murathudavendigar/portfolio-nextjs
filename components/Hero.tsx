import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";

type Props = {};

const Hero = (props: Props) => {
  const [text, count] = useTypewriter({
    words: [
      "Hi, I am Murat Hüdavendigâr",
      "John Cpt. Price",
      "This is my portfolio site",
    ],
    loop: true,
    delaySpeed: 2000,
  });
  const [title, count2] = useTypewriter({
    words: ["Frontend - React.js | Next.js", "Backend - Django | .NET"],
    loop: true,
    delaySpeed: 2000,
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 overflow-hidden text-center">
      <BackgroundCircles />
      <Image
        src="https://avatars.githubusercontent.com/u/109613328?v=4"
        alt="photos"
        className="relative object-cover rounded-full"
        width={128}
        height={128}
        loading="lazy"
      />
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 dark:text-gray-900 pb-2 tracking-[15px]">
          <span>{title}</span>
          <Cursor cursorColor="#CA3E47" />
        </h2>
        <h1 className="px-10 text-5xl font-semibold lg:text-6xl">
          <span className="mr-3">{text}</span>
          <Cursor cursorColor="#CA3E47" />
        </h1>

        <div className="pt-5">
          <Link href="#about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="#experience">
            <button className="heroButton">Experience</button>
          </Link>
          <Link href="#skills">
            <button className="heroButton">Skills</button>
          </Link>
          <Link href="#projects">
            <button className="heroButton">Projects</button>
          </Link>
          <Link href="/blogs">
            <button className="heroButton">Blogs</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
