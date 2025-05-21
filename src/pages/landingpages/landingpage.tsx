import HeroSection from "./LandingPreview/herosection";
import GroupSection from "./LandingPreview/groupsection";
import LevelUpSection from "./LandingPreview/levelup";
import HowItWorks from "./LandingPreview/HowItWorks";
import Plans from "./LandingPreview/Plans";
import Questions from "./LandingPreview/Questions";
import Contact from "./LandingPreview/Contact";
import Footer from "./LandingPreview/Footer";
import Header from "../../components/layout/header";
const LandingPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <GroupSection />
      <LevelUpSection />
      <HowItWorks />
      <Plans />
      <Questions />
      <Contact />
      <Footer />
    </div>
  )
}

export default LandingPage
