import { FC, useState } from "react";
import { Check, CreditCard } from "lucide-react";

const PlansPagePage: FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  const plans = {
    creator: {
      name: "Creator",
      price: { monthly: 199, annual: 149 },
      description:
        "For individuals starting to create 3D scenes from video content.",
      features: [
        "Generate up to 4 Digital Twins per month",
        "Standard Video-to-3D Conversion AI",
        "Basic Scene and Object Recognition",
        "Export to standard 3D formats",
        "Community Support",
      ],
      isCurrent: true,
    },
    pro: {
      name: "Pro Plan",
      price: { monthly: 299, annual: 249 },
      description:
        "For professionals and teams requiring higher quality and more volume.",
      features: [
        "Generate up to 12 Digital Twins per month",
        "Advanced Video-to-3D Conversion AI",
        "High-Fidelity Texture Generation",
        "Direct Unreal Engine Integration",
        "Team Collaboration (up to 5 users)",
        "Priority Email Support",
      ],
      isPopular: true,
    },
    business: {
      name: "Business Plan",
      price: "Custom" as const,
      description:
        "For large-scale operations needing tailored solutions and support.",
      features: [
        "Custom Digital Twin generation limits",
        "Personalized AI model training",
        "API Access for workflow automation",
        "Advanced security & compliance features",
        "Dedicated account manager & onboarding",
        "24/7 Premium Support",
      ],
    },
  };

  type Plan =
    | typeof plans.creator
    | typeof plans.pro
    | typeof plans.business;

  const PlanCard: FC<{ plan: Plan }> = ({ plan }) => {
    const price =
      plan.price !== "Custom"
        ? billingCycle === "annual"
          ? plan.price.annual
          : plan.price.monthly
        : null;

    return (
      <div
        className={`bg-[#262629] border rounded-lg p-6 flex flex-col ${
          "isPopular" in plan && plan.isPopular
            ? "border-indigo-500"
            : "border-[#3A3A3C]"
        }`}
      >
        {"isPopular" in plan && plan.isPopular && (
          <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
            Popular
          </div>
        )}

        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-[#A0A0A5] mt-2 mb-4 flex-grow">{plan.description}</p>

        {plan.price === "Custom" ? (
          <p className="text-4xl font-bold text-white mb-1">Custom</p>
        ) : (
          <p className="text-4xl font-bold text-white mb-1">${price}</p>
        )}

        <p className="text-[#A0A0A5] text-sm mb-6">
          {plan.price === "Custom"
            ? "Contact us for a quote"
            : "Per user & per month"}
        </p>

        {"isCurrent" in plan && plan.isCurrent ? (
          <button className="w-full bg-[#3A3A3C] text-white font-semibold py-2.5 px-4 rounded-md mb-2">
            Current Plan
          </button>
        ) : (
          <button
            className={`w-full font-semibold py-2.5 px-4 rounded-md mb-2 ${
              "isPopular" in plan && plan.isPopular
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {plan.name === "Business Plan"
              ? "Contact Sales"
              : "Switch to this Plan"}
          </button>
        )}

        <p className="text-center text-xs text-[#A0A0A5]">
          {plan.name === "Business Plan"
            ? "Start Free 15-Days Trial"
            : "Start Free 7-Days Trial"}
        </p>

        <hr className="border-t border-[#3A3A3C] my-6" />

        <div className="space-y-3">
          <h4 className="font-semibold text-white">Features</h4>
          <p className="text-sm text-[#A0A0A5]">
            Everything in our free plan includes
          </p>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="text-indigo-400" size={16} />
              <span className="text-sm text-[#A0A0A5]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <CreditCard size={40} /> Pricing Plans
        </h2>
        <p className="text-lg text-[#A0A0A5] mt-2">
          Choose the plan that's right for your team.
        </p>
      </div>

      {/* Toggle Billing Cycle */}
      <div className="flex justify-center items-center mb-10">
        <div className="bg-[#262629] p-1 rounded-lg flex items-center gap-2 relative">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              billingCycle === "monthly"
                ? "bg-[#3A3A3C] text-white"
                : "text-[#A0A0A5] hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors relative ${
              billingCycle === "annual"
                ? "bg-indigo-500 text-white"
                : "text-[#A0A0A5] hover:text-white"
            }`}
          >
            Annual
            <span className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              Save 50%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PlanCard plan={plans.creator} />
        <PlanCard plan={plans.pro} />
        <PlanCard plan={plans.business} />
      </div>
    </div>
  );
};

export default PlansPagePage;
