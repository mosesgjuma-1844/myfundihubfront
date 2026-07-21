import Header from "../components/header/Header";
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";
import Services from "../components/services/Services";
import HowItWorks from "../components/howitworks/HowItWorks";
import Testmonies from "../components/testmonies/Testmonies";
import ForTechnicians from "../components/fortechnicians/ForTechnicians";
const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Testmonies />
      <ForTechnicians />
      <Footer />
    </>
  );
};

export default LandingPage;