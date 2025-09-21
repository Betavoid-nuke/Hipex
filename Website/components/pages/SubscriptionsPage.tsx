interface SubscriptionsPageProps {
    onContactClick: () => void;
}

const SubscriptionsPage = ({ onContactClick }: SubscriptionsPageProps) => {
    return (
        <section id="subscriptions" className="page pt-32 pb-24">
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
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {/* Hobbyist Plan */}
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-indigo-600 transition-colors duration-300">
                        <h4 className="text-2xl font-bold text-white mb-2">Hobbyist</h4>
                        <p className="text-gray-400 mb-6">For individual creators and enthusiasts.</p>
                        <div className="flex items-end justify-center my-6">
                            <span className="text-5xl font-extrabold text-white">$999</span>
                            <span className="text-xl text-gray-400">/month</span>
                        </div>
                        <button className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 mb-8">
                            Get Started
                        </button>
                        {/* Features list */}
                    </div>

                    {/* Professional Plan */}
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-600 transition-colors duration-300 relative">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">Most Popular</div>
                        <h4 className="text-2xl font-bold text-white mb-2">Professional</h4>
                        <p className="text-gray-400 mb-6">For professionals and small studios.</p>
                        <div className="flex items-end justify-center my-6">
                            <span className="text-5xl font-extrabold text-white">$2500</span>
                            <span className="text-xl text-gray-400">/month</span>
                        </div>
                        <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 mb-8">
                            Get Started
                        </button>
                       {/* Features list */}
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-blue-600 transition-colors duration-300">
                        <h4 className="text-2xl font-bold text-white mb-2">Enterprise</h4>
                        <p className="text-gray-400 mb-6">For large-scale projects and custom needs.</p>
                        <div className="flex items-end justify-center my-6">
                            <span className="text-5xl font-extrabold text-white">Custom</span>
                        </div>
                        <button onClick={onContactClick} className="w-full py-3 rounded-full bg-transparent border-2 border-indigo-600 text-white font-bold hover:bg-indigo-600 transition-colors duration-300 mb-8">
                            Contact Us
                        </button>
                        {/* Features list */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionsPage;