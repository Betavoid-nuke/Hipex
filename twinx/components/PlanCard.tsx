
// /twinx/components/PlanCard.tsx
'use client';

import { Check } from "lucide-react";

interface PlanCardProps {
    plan: {
        name: string;
        price: { monthly: number; annual: number } | 'Custom';
        description: string;
        features: string[];
        isCurrent?: boolean;
        isPopular?: boolean;
    };
    billingCycle: 'monthly' | 'annual';
}

const PlanCard = ({ plan, billingCycle }: PlanCardProps) => {
    const price = plan.price !== 'Custom' ? (billingCycle === 'annual' ? plan.price.annual : plan.price.monthly) : null;

    return (
        <div className={`bg-[#262629] border rounded-lg p-6 flex flex-col ${plan.isPopular ? 'border-indigo-500' : 'border-[#3A3A3C]'}`}>
            {plan.isPopular && (
                <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
                    Popular
                </div>
            )}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-[#A0A0A5] mt-2 mb-4 flex-grow">{plan.description}</p>

            {price === null ? (
                 <p className="text-4xl font-bold text-white mb-1">Custom</p>
            ) : (
                 <p className="text-4xl font-bold text-white mb-1">${price}</p>
            )}

            <p className="text-[#A0A0A5] text-sm mb-6">{price === null ? 'Contact us for a quote' : 'Per user & per month'}</p>

            {plan.isCurrent ? (
                <button className="w-full bg-[#3A3A3C] text-white font-semibold py-2.5 px-4 rounded-md mb-2 cursor-default">Current Plan</button>
            ) : (
                 <button className={`w-full font-semibold py-2.5 px-4 rounded-md mb-2 ${plan.isPopular ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white text-black hover:bg-gray-200'}`}>
                    {plan.name === 'Business Plan' ? 'Contact Sales' : 'Switch to this Plan'}
                </button>
            )}

            <p className="text-center text-xs text-[#A0A0A5]">
                {plan.name === 'Business Plan' ? 'Start Free 15-Days Trial' : 'Start Free 7-Days Trial'}
            </p>

            <hr className="border-t border-[#3A3A3C] my-6" />

            <div className="space-y-3">
                <h4 className="font-semibold text-white">Features</h4>
                <p className="text-sm text-[#A0A0A5]">Everything in our free plan includes</p>
                {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                        <Check className="text-indigo-400" size={16} />
                        <span className="text-sm text-[#A0A0A5]">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanCard;