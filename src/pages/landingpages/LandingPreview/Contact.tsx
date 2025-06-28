import { Button } from "@/components/ui/button";
import image from "../../../assets/Contact.jpg";
import Header from "@/components/layout/header";
import Footer from "./Footer";

interface ContactProps {
  isInLandingPage?: boolean;
}

export default function Contact({ isInLandingPage = false }: ContactProps) {
  return (
    <>
      {!isInLandingPage && <Header />}
      <section id="contact-section" className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
                Have questions<br className="hidden sm:block" />or need more<br className="hidden sm:block" />information?
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
              Our team is here to help you with any questions you might have about our platform, features, or services.
            </p>
            <Button 
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
            >
              Contact us
            </Button>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
              <img
                src={image}
                alt="Contact"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {!isInLandingPage && <Footer />}
    </>
  );
}
