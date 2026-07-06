import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#CA3E47]/80 font-custom transition-all duration-500 scroll-smooth">
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
              alt="Murat Hüdavendigâr Öncü — back to top"
              width={44}
              height={44}
              loading="lazy"
            />
          </div>
        </footer>
      </Link>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            url: site.url,
            jobTitle: "Frontend Developer",
            email: `mailto:${site.email}`,
            image: `${site.url}/img/MHO.jpg`,
            sameAs: Object.values(site.socials),
          }),
        }}
      />
    </div>
  );
}
