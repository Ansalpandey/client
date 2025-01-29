import Hero from "../components/Hero";
import Mid from "../components/Mid";
import NavBar from "../components/NavBar";
import Waitlist from "../components/Waitlist";
import FeaturesSection from "../components/Feature";
import FAQ from "../components/FAQ";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <NavBar />
      <Hero />
      <Mid/>
      <Waitlist />
      <FeaturesSection />
      <FAQ />
      <NewsLetter />
      <Footer />
    </div>
  );
} 