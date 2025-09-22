import PriceCards from "../Components/PriceCards";

interface SubscriptionsPageProps {
    onContactClick: () => void;
}

const SubscriptionsPage = ({ onContactClick }: SubscriptionsPageProps) => {
    return (
        <section id="subscriptions" className="page pt-32 pb-24" style={{ display: 'block' }}>
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Flexible Pricing for Every <span className="gradient-text">Creator</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
                    Choose the plan that fits your needs, from a hobbyist to a professional studio. All plans are credit-based for maximum flexibility.
                </p>
                
                {/* Credit Explanation */}
                <div className="mb-16 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-2xl font-bold text-white mb-2">How Credits Work</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        One credit is equivalent to one minute of video processing time. The more credits you have, the more you can create. Higher tiers offer a lower cost per credit, giving you more value as you scale up your projects.
                    </p>
                </div>
                
                {/* Pricing Tiers */}
                <PriceCards />
            </div>
        </section>
    );
};

export default SubscriptionsPage;