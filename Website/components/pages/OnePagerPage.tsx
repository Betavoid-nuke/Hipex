import BackgroundMain from "../Components/Background";

interface OnePagerPageProps {
    onContactClick: () => void;
}

const OnePagerPage = ({ onContactClick }: OnePagerPageProps) => {
    return (
        <section id="one-pager" className="page pt-32 pb-24 bg-gray-950" style={{ display: 'block', paddingTop:'20px' }}>
            <BackgroundMain />
            <div className="container mx-auto px-4 max-w-5xl" style={{zIndex:'2', position:'relative'}}>

                {/* Header Section */}
                <div style={{paddingTop:'150px', paddingBottom:'100px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white text-center mb-6">
                        The Future is Here.
                        <span className="gradient-text block">Video to Digital Twin AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 text-center max-w-4xl mx-auto mb-20">We are making it posible for people to convert video of their real estate into a AAA-quality 3D digital twin hosted on web with Pixelcanvas.</p>
                    <button onClick={onContactClick} className="primary-button" style={{marginTop:'-60px'}}>
                        Invest in Hipex
                    </button>
                </div>

                {/* Core Advantage Section */}
                <div className="text-center mb-20" style={{marginBottom:'150px'}}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6" style={{marginBottom:'50px'}}>Our Core Advantage</h2>
                    <div className="grid md:grid-col-3 gap-8" style={{display:'flex', flexWrap:'nowrap', justifyContent:'center', alignItems:'center', rowGap:'20px', flexDirection:'row', gap:'50px'}}>
                        {/* Unmatched Realism */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
                            <h3 className="text-2xl font-bold text-white mb-2">Unmatched Realism</h3>
                            <p className="text-gray-400 text-sm">Our platform leverages the power of Unreal Engine to transform videos into stunning, photorealistic Digital Twins with AAA-quality graphics.</p>
                        </div>
                        {/* Zero Barriers */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
                            <h3 className="text-2xl font-bold text-white mb-2">Zero Barriers</h3>
                            <p className="text-gray-400 text-sm">Thanks to Pixelcanvas, our Digital Twins are streamed directly to any web browser, eliminating the need for downloads, plugins, or high-end hardware.</p>
                        </div>
                        {/* Accelerated Creation */}
                        <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
                            <h3 className="text-2xl font-bold text-white mb-2">Accelerated Creation</h3>
                            <p className="text-gray-400 text-sm">Our proprietary AI algorithms reduce the creation of complex Digital Twin environments from months to seconds, giving creators a massive competitive edge.</p>
                        </div>
                    </div>
                </div>

                {/* AI-Powered Workflow Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12">Our AI Pipeline</h2>
                    <div className="process-flow" style={{marginTop:'-30px'}}>
                        <div className="process-step">
                            <div className="process-step-box" style={{height:'-webkit-fill-available', background:'rgb(118 81 151 / 34%)', border:'none'}}><span className="process-step-icon">⬆️</span><p className="process-step-text font-semibold text-white">Video Upload</p><p className="process-step-text text-xs">Users upload a video of their real-world space.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box" style={{height:'-webkit-fill-available', background:'rgb(118 81 151 / 34%)', border:'none'}}><span className="process-step-icon">🤖</span><p className="process-step-text font-semibold text-white">AI Analysis</p><p className="process-step-text text-xs">Our AI processes frames, maps the floor plan, and detects objects.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box" style={{height:'-webkit-fill-available', background:'rgb(118 81 151 / 34%)', border:'none'}}><span className="process-step-icon">🧱</span><p className="process-step-text font-semibold text-white">3D Reconstruction</p><p className="process-step-text text-xs">AI builds the 3D model, including walls and object placement.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box" style={{height:'-webkit-fill-available', background:'rgb(118 81 151 / 34%)', border:'none'}}><span className="process-step-icon">🔗</span><p className="process-step-text font-semibold text-white">TwinID Generation</p><p className="process-step-text text-xs">A unique ID is created for the new Digital Twin.</p></div>
                        </div>
                        <div className="process-arrow"></div>
                        <div className="process-step">
                            <div className="process-step-box" style={{height:'-webkit-fill-available', background:'rgb(118 81 151 / 34%)', border:'none'}}><span className="process-step-icon">🌐</span><p className="process-step-text font-semibold text-white">Publish or List</p><p className="process-step-text text-xs">Users Copy Unique ID into Unreal Engine TwinX Plugin and Digital Twin Magically downloads into their Map, publish to a web on Pixelcanvas, or list it on the marketplace.</p></div>
                        </div>
                    </div>
                </div>

                {/* Market & Traction Section */}
                <div className="text-center mb-20" style={{marginBottom:'150px'}}>
                     <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Massive Market, Proven Traction</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">The digital twin market is projected to exceed **$800B by 2030**. Hipex is perfectly positioned to capture this growth, with solutions already driving powerful results.</p>
                    <div className="grid sm:grid-cols-2 gap-8 text-left" style={{display:'flex', flexWrap:'nowrap', justifyContent:'center', alignItems:'center', rowGap:'20px', flexDirection:'row', gap:'50px'}}>
                        <div className="p-6 rounded-xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300" style={{height:'-webkit-fill-available', background:'rgb(101 26 105 / 34%)', border:'none'}}>
                            <h3 className="text-xl font-bold text-white mb-2">Real Estate</h3>
                            <p className="text-gray-400 text-sm">A major firm used Hipex to create immersive property tours, leading to a <strong>40% reduction</strong> in sales cycles.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300" style={{height:'-webkit-fill-available', background:'rgb(101 26 105 / 34%)', border:'none'}}>
                            <h3 className="text-xl font-bold text-white mb-2">Retail</h3>
                            <p className="text-gray-400 text-sm">A global brand used Hipex for a virtual storefront, driving a <strong>3x increase</strong> in average order value.</p>
                        </div>
                    </div>
                </div>
                
                {/* Video Pitch Section */}
                <div className="text-center mb-20" style={{marginBottom:'150px'}}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Our Video Pitch</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">See a detailed explanation of the Hipex platform and our vision for the future.</p>
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl animated-gradient-border">
                        <iframe className="video-iframe w-full max-w-[1920px] h-[750px] md:h-screen" src="https://www.youtube.com/embed/A6GufbxJvQs?autoplay=1&mute=1&loop=1&playlist=A6GufbxJvQs&controls=0&modestbranding=1&showinfo=0&rel=0" title="Hipex Investor Pitch" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Don't Miss the Future.</h2>
                    <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">The next wave of Digital Revolution is here.</p>
                    <button onClick={onContactClick} className="primary-button px-12 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                        Invest in Hipex
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OnePagerPage;