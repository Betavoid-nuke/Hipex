interface OnePagerPageProps {
    onContactClick: () => void;
}

const OnePagerPage = ({ onContactClick }: OnePagerPageProps) => {
    return (
        <section id="one-pager" className="page pt-32 pb-24 bg-gray-950" style={{ display: 'block' }}>
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white text-center mb-6">
                    The Future is Here.
                    <span className="gradient-text block">The Digital Twin is Now.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 text-center max-w-4xl mx-auto mb-20">We are unlocking the next era of digital creation by democratizing hyper-realistic Digital Twin building with AI.</p>
                
                {/* Core Advantage Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Our Core Advantage</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Unmatched Realism */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
                            <h3 className="text-2xl font-bold text-white mb-2">Unmatched Realism</h3>
                            <p className="text-gray-400 text-sm">Our platform leverages the power of Unreal Engine to transform videos into stunning, photorealistic Digital Twins with AAA-quality graphics.</p>
                        </div>
                        {/* Zero Barriers */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
                            <h3 className="text-2xl font-bold text-white mb-2">Zero Barriers</h3>
                            <p className="text-gray-400 text-sm">Thanks to Pixelcanvas, our Digital Twins are streamed directly to any web browser, eliminating the need for downloads, plugins, or high-end hardware.</p>
                        </div>
                        {/* Accelerated Creation */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                            <h3 className="text-2xl font-bold text-white mb-2">Accelerated Creation</h3>
                            <p className="text-gray-400 text-sm">Our proprietary AI algorithms reduce the creation of complex Digital Twin environments from months to seconds, giving creators a massive competitive edge.</p>
                        </div>
                    </div>
                </div>

                {/* AI-Powered Workflow Section */}
                <div className="text-center mb-20">
                     <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12">Our AI-Powered Workflow</h2>
                    <div className="process-flow">
                        <div className="process-step">
                            <div className="process-step-box"><span className="process-step-icon">⬆️</span><p className="process-step-text font-semibold text-white">Video Upload</p><p className="process-step-text text-xs">Users upload a video of their real-world space.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box"><span className="process-step-icon">🤖</span><p className="process-step-text font-semibold text-white">AI Analysis</p><p className="process-step-text text-xs">Our AI processes frames, maps the floor plan, and detects objects.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box"><span className="process-step-icon">🧱</span><p className="process-step-text font-semibold text-white">3D Reconstruction</p><p className="process-step-text text-xs">AI builds the 3D model, including walls and object placement.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box"><span className="process-step-icon">🔗</span><p className="process-step-text font-semibold text-white">TwinID Generation</p><p className="process-step-text text-xs">A unique ID is created for the new Digital Twin.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box"><span className="process-step-icon">🌐</span><p className="process-step-text font-semibold text-white">Publish or List</p><p className="process-step-text text-xs">Users publish to a web experience or list it on the marketplace.</p></div>
                        </div>
                    </div>
                </div>

                {/* Market & Traction Section */}
                <div className="text-center mb-20">
                     <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Massive Market, Proven Traction</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">The digital twin market is projected to exceed **$800B by 2030**. Hipex is perfectly positioned to capture this growth, with solutions already driving powerful results.</p>
                    <div className="grid sm:grid-cols-2 gap-8 text-left">
                        <div className="p-6 rounded-xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Real Estate</h3>
                            <p className="text-gray-400 text-sm">A major firm used Hipex to create immersive property tours, leading to a <strong>40% reduction</strong> in sales cycles.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Retail</h3>
                            <p className="text-gray-400 text-sm">A global brand used Hipex for a virtual storefront, driving a <strong>3x increase</strong> in average order value.</p>
                        </div>
                    </div>
                </div>
                
                {/* Video Pitch Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Our Video Pitch</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">See a detailed explanation of the Hipex platform and our vision for the future.</p>
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl animated-gradient-border">
                        <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Hipex Investor Pitch" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Don't Miss the Future.</h2>
                    <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">The next wave of the internet is being built right now. Secure your place at the forefront.</p>
                    <button onClick={onContactClick} className="px-12 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                        Invest in Hipex
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OnePagerPage;