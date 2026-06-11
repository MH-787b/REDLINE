import Scene from "@/components/canvas/Scene";
import Smooth from "@/components/providers/Smooth";
import PhaseTracker from "@/components/providers/PhaseTracker";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/ui/Nav";
import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Collection from "@/components/sections/Collection";
import Signup from "@/components/sections/Signup";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <Smooth>
      <Preloader />
      <Scene />
      <PhaseTracker />
      <Cursor />
      <Nav />
      <div className="relative z-10">
        <main>
          <Hero />
          <Collection />
          <Manifesto />
          <Signup />
        </main>
        <Footer />
      </div>
    </Smooth>
  );
}
