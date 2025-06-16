import React from "react";
import Header from '../../../../components/layout/header';
import Footer from '../Footer';
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const planFeatures = [
  "Profile Name and Image",
  "Review Ratings",
  "Job Title and Job Specialization",
  "Client's Previews Reviews",
  "Copy URL Link",
  "Displays Services, Experiences, Skills and Tools",
  "Multiple Languages Support",
  "Custom Categories",
];

const PLAN_NAME = "Standard Plan";
const PLAN_PRICE = 10;
const PLAN_PERIOD = "/semiannually";

const paymentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  card: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number format"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const StandardPlan: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      // Simulate API call with form data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Payment data:', data);
      toast.success("Payment successful!");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-8 px-2 sm:px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#5A8DB8] drop-shadow">
          {PLAN_NAME} Checkout
        </h1>
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Plan Details */}
          <Card className="border-2 border-[#5A8DB8] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-2xl font-bold text-[#5A8DB8]">{PLAN_NAME}</CardTitle>
              <div className="text-4xl font-extrabold text-[#222]">
                <span className="text-2xl align-top">USD</span> {PLAN_PRICE}
                <span className="text-base font-semibold text-gray-600">{PLAN_PERIOD}</span>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="mb-4 font-semibold text-lg">Includes:</h3>
              <ul className="space-y-3 text-gray-700 text-base">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-xl text-[#5A8DB8]">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Smith"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card">Card Number</Label>
                  <Input
                    id="card"
                    {...register("card")}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.card && (
                    <p className="text-sm text-red-500">{errors.card.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      {...register("expiry")}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiry && (
                      <p className="text-sm text-red-500">{errors.expiry.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      {...register("cvc")}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvc && (
                      <p className="text-sm text-red-500">{errors.cvc.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Complete Payment ($${PLAN_PRICE}.00)`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outline"
          className="border-[#5A8DB8] text-[#5A8DB8] hover:bg-[#5A8DB8] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          onClick={() => navigate('/plans')}
        >
          Go Back to Pricing
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default StandardPlan;
