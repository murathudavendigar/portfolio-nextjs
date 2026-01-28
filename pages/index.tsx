import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
      <Head>
        <title>Murat Hüdavendigâr Öncü</title>
      </Head>

      <Header />

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="about" className="snap-center">
        <About />
      </section>

      <section id="experience" className="snap-center">
        <Experience />
      </section>
      <section id="skills" className="snap-start">
        <Skills />
      </section>

      <section id="projects" className="snap-start">
        <Projects />
      </section>

      <section id="contact" className="snap-start">
        <Contact />
      </section>

      <Link href="#hero">
        <footer className="sticky w-full cursor-pointer bottom-16 md:bottom-5">
          <div className="flex items-center justify-center">
            <Image
              className="object-cover rounded-full cursor-pointer h-11 w-11 filter grayscale hover:grayscale-0"
              src="/img/MHO.jpg"
              alt=""
              width={44}
              height={44}
              loading="lazy"
            />
          </div>
        </footer>
      </Link>
    </div>
  );
};

export default Home;
