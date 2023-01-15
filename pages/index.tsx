import About from "@/components/About";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Head from "next/head";

const Home = () => {
  return (
    <div className="bg-[rgb(36,36,36)] text-white h-screen snap-y snap-mandatory overflow-scroll z-0">
      <Head>
        <title>Murat Hüdavendigâr Öncü</title>
      </Head>

      <Header />
      {/* Hero  */}
      <section id="hero" className="snap-start">
        <Hero />
      </section>
      {/* About */}

      <section id="about" className="snap-center">
        <About />
      </section>

      {/* Experience */}

      {/* Skills */}

      {/* Projects  */}

      {/* Contact Me  */}
    </div>
  );
};

export default Home;
