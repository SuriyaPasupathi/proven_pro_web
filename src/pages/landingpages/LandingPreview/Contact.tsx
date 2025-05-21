import { Button } from "@/components/ui/button";
import image from "../../../assets/Contact.jpg";

export default function Contact() {
  return (
    <section id="contact-section" className="w-full bg-white py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Have questions<br />or need more<br />information?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
            Have questions or need more information?<br />
            Our team is here to help.
          </p>
          <Button className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base">
            Contact us
          </Button>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-full h-full bg-gray-200 rounded-md shadow-lg -z-10"></div>
            <img
              src={image}
              alt="Contact"
              className="rounded-md shadow-lg max-w-full h-auto object-cover"
              style={{ minWidth: 160, maxWidth: 400 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
