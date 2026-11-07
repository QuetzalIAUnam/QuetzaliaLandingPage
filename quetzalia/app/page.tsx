import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Levels from "@/components/Levels";
import Agenda from "@/components/Agenda";
import Allies from "@/components/Allies";
import Signup from "@/components/Signup";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import MobileFloatingDock from "@/components/MobileFloatingDock";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <About />
        <Stats />
        <Levels />
        <Agenda />
        <Allies />
        <Signup />
        <Faq />
      </main>
      <Footer />
      <MobileFloatingDock />
    </>
  );
}
