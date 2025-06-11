import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "What is ProvenPro?",
    answer: (
      <>
        ProvenPro is a platform where freelancers can showcase their standout profiles, demonstrate expertise, build trust, and highlight their skills and past achievements to secure new opportunities more quickly.
        <br />
        Freelancers can add this to their resume, cover letter, or application on various job market platforms.
      </>
    ),
  },
  {
    question: "Lorem ipsum dolor sit amet aut consequatur mollitia ut aspernatur harum non dicta dolorum et omnis suscipit?",
    answer: "This is a placeholder answer. You can replace it with real content.",
  },
  {
    question: "Est inventore harum est ducimus voluptas non galisum fugit hic omnis voluptas sed quam odio quo?",
    answer: "This is another placeholder answer to show responsiveness.",
  },
  {
    question: "Vel ipsa voluptates et deserunt voluptas eum similique?",
    answer: "Yet another answer for demonstration purposes.",
  },
  {
    question: "A voluptas explicabo in repellendus saepe sed fugit eius rem similique dignissimos quo ipsam omnis! Id nesciunt?",
    answer: "Add helpful FAQ content here.",
  },
];

export default function Questions() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const navigate = useNavigate();
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-gray-300 border-t border-b border-gray-300">
        {faqs.map((faq, idx) => (
          <div key={faq.question} className="py-4 sm:py-6">
            <button
              className="flex items-start w-full text-left focus:outline-none"
              onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="mr-3 sm:mr-4 mt-1 text-lg sm:text-xl transition-transform duration-200">
                {openIndex === idx ? "⌄" : ">"}
              </span>
              <span className={`font-semibold text-sm sm:text-base md:text-lg ${openIndex === idx ? "font-bold" : ""}`}>
                {faq.question}
              </span>
            </button>
            {openIndex === idx && faq.answer && (
              <div className="pl-6 sm:pl-10 pt-2 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 sm:mt-12">
          <Button className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base"
          onClick={() => navigate('/signup')}
          >
          Sign up now
        </Button>
      </div>
    </section>
  );
}
