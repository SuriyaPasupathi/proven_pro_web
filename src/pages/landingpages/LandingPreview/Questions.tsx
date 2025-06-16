import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Question {
  question: string;
  answer: string;
}

const questions: Question[] = [
  {
    question: "What is Proven Pro?",
    answer: "Proven Pro is a professional platform that helps freelancers showcase their skills, experience, and client reviews in a comprehensive profile. It's designed to help you stand out to potential clients and employers."
  },
  {
    question: "How does the pricing work?",
    answer: "We offer three plans: Basic (Free), Standard, and Premium. The Basic plan includes essential features, while Standard and Premium plans offer additional features like multiple languages support, custom categories, and portfolio display. All paid plans are billed semiannually."
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for a free account, complete your profile with your skills and experience, and start showcasing your work. You can upgrade to a paid plan anytime to access more features."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and other popular payment methods. All payments are processed securely through our payment partners."
  }
];

export default function Questions() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-700 text-lg">
            Find answers to common questions about our platform, pricing, and features.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <button
                onClick={() => handleClick(index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-blue-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-800 hover:text-[#5A8DB8] transition-colors duration-200">
                  {q.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#5A8DB8] transform transition-transform duration-200 ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {expandedIndex === index && (
                <div className="px-6 pb-4 bg-blue-50/50">
                  <p className="text-gray-700">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4 text-lg">
            Still have questions? We're here to help!
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
