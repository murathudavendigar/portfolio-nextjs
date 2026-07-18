"use client";
import Image from "next/image";
import Link from "next/link";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import BackgroundCircles from "./BackgroundCircles";

const HERO_LINES = [
  "Hi, I am Murat Hüdavendigâr Öncü",
  "I build fast, modern web apps",
  "Open to new opportunities",
] as const;

const TITLE_LINES = [
  "Frontend · React / Next.js",
  "Backend · Django / .NET",
] as const;

const Hero = () => {
  const [text] = useTypewriter({
    words: [...HERO_LINES],
    loop: true,
    delaySpeed: 2000,
  });
  const [title] = useTypewriter({
    words: [...TITLE_LINES],
    loop: true,
    delaySpeed: 2000,
  });

  const visibleTitle = title || TITLE_LINES[0];
  const visibleText = text || HERO_LINES[0];

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 overflow-hidden text-center">
      <BackgroundCircles />
      <Image
        src="/img/MHO.jpg"
        alt="Murat Hüdavendigâr Öncü — frontend developer portrait"
        className="relative object-cover rounded-full"
        width={128}
        height={128}
        priority
      />
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 dark:text-gray-900 pb-2 tracking-[15px]">
          <span className="sr-only">
            Frontend developer specializing in React, Next.js, Django, and .NET
          </span>
          <span aria-hidden="true">
            <span>{visibleTitle}</span>
            <Cursor cursorColor="#CA3E47" />
          </span>
        </h2>
        <h1 className="px-10 text-5xl font-semibold lg:text-6xl">
          <span className="sr-only">
            Murat Hüdavendigâr Öncü — Frontend Developer
          </span>
          <span aria-hidden="true">
            <span className="mr-3">{visibleText}</span>
            <Cursor cursorColor="#CA3E47" />
          </span>
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
            <button className="heroButton">Blog</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
