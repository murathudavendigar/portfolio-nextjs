import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "./BackgroundCircles";

const HERO_HEADLINE = "Hi, I am Murat Hüdavendigâr Öncü";
const HERO_TITLE = "Frontend · React / Next.js / iOS";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 overflow-hidden text-center py-20">
      <BackgroundCircles />
      <Image
        src={site.profileImage}
        alt="Murat Hüdavendigâr Öncü — frontend developer portrait"
        className="relative object-cover rounded-full"
        width={128}
        height={128}
        priority
      />
      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-200 dark:text-gray-900 pb-2 tracking-[15px]">
          {HERO_TITLE}
        </h2>
        <h1 className="px-10 text-5xl font-semibold lg:text-6xl">
          {HERO_HEADLINE}
        </h1>

        <div className="pt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/work">
            <button className="heroButton">Work</button>
          </Link>
          <Link href="/about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="/writing">
            <button className="heroButton">Writing</button>
          </Link>
          <Link href="/contact">
            <button className="heroButton">Contact</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
