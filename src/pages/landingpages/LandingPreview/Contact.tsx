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

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 relative z-10">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
                Have Questions<br className="hidden sm:block" />Or Need More<br className="hidden sm:block" />Information?
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0">
              Our team is here to help you with any questions you might have about our platform, features, or services.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button 
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
              >
                Contact us
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px]">
              <img
                src={image}
                alt="Contact"
                className="w-full h-auto object-cover rounded-lg shadow-lg transform scale-x-[-1]"
              />
            </div>
          </div>
        </div>
      </section>
      {!isInLandingPage && <Footer />}
    </>
  );
}
