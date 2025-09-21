interface HomePageProps {
    onWaitlistClick: () => void;
    onContactClick: () => void;
}

const HomePage = ({ onWaitlistClick, onContactClick }: HomePageProps) => {
    return (
        <section id="home" className="home-section">
            <div className="home-bg" style={{backgroundImage: "url('https://placehold.co/1920x1080/0d0d0f/3730a3?text=Hipex+Background')"}}></div>
            <div className="home-content">
                <h1 className="home-title">
                    Transform any video into a <br /><span className="gradient-text">stunning, hyper-realistic Digital Twin.</span>
                </h1>
                <p className="home-subtitle">Hipex is a cutting-edge AI digital twinning platform that uses Unreal Engine for hyper-realism and Pixelcanvas to deliver seamless, web-based metaverse experiences.</p>
                <div className="home-buttons">
                    <button onClick={onWaitlistClick} className="primary-button">
                        Join Waitlist
                    </button>
                    <a href="#" onClick={(e) => e.preventDefault()} className="secondary-button">
                        Launch Platform
                    </a>
                </div>
                <div className="my-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-300">Watch our demo:</h2>



















                    <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-xl p-[3px]">
                      <div className="relative w-full h-full rounded-xl bg-black">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src="https://www.youtube.com/embed/u6lihZAcy4s"
                          title="HypeX Demo Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{border: 'none'}}
                        />
                      </div>
                    </div>

                    iframe issue

















                </div>
                <div className="my-8">
                    <div id="about">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
                            The Technology Behind <span className="gradient-text">Hipex</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all transform hover:scale-105">
                                <svg className="w-12 h-12 mb-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V11h-2v6.5h2zm1-12.25c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM15 17.5v-6.5h-2v6.5h2z"/></svg>
                                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Digital Twinning</h3>
                                <p className="text-gray-400">Our proprietary artificial intelligence analyzes video footage to automatically reconstruct and convert real-world environments into a precise digital twin.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all transform hover:scale-105">
                                <svg className="w-12 h-12 mb-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h14v-8h3L12 2zm-1 15h2v-6h-2v6z"/></svg>
                                <h3 className="text-2xl font-bold text-white mb-2">Unreal Engine Hyper-Realism</h3>
                                <p className="text-gray-400">We leverage the power of Unreal Engine to ensure every digital twin is rendered with stunning, photorealistic detail, mirroring the source video with AAA-quality graphics.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105">
                                <svg className="w-12 h-12 mb-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 12h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2H3v2H1v2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v-2h-2z"/></svg>
                                <h3 className="text-2xl font-bold text-white mb-2">Pixelcanvas Web Metaverse</h3>
                                <p className="text-gray-400">Your generated digital twins are seamlessly published to the web using Pixelcanvas, allowing anyone to access and experience your creations directly from their browser.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-24">
                     <div id="pricing">
                         <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                             Flexible <span className="gradient-text">Subscription Plans</span>
                         </h2>
                         <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">Choose the plan that fits your needs, from a hobbyist to a professional studio.</p>
                         
                            <div className="container">
                                <div className="apps-grid">
                                  {/* Hobbyist */}
                                  <div className="app-card">
                                    <h3>Hobbyist</h3>
                                    <p>For individual creators and enthusiasts.</p>
                                    <div className="price-block">
                                      <span className="price">$999</span>
                                      <span className="per">/month</span>
                                    </div>
                                    <ul>
                                      <p>✔ 5 digital twins per month</p>
                                      <p>✔ Standard generation speed</p>
                                      <p>✔ Basic support</p>
                                    </ul>
                                    <button className="primary-button">Get Started</button>
                                  </div>

                                  {/* Professional */}
                                  <div className="app-card">
                                    <h3>Professional</h3>
                                    <p>For professionals and small studios.</p>
                                    <div className="price-block">
                                      <span className="price">$2500</span>
                                      <span className="per">/month</span>
                                    </div>
                                    <ul>
                                      <p>✔ 20 digital twins per month</p>
                                      <p>✔ High-priority generation</p>
                                      <p>✔ Premium support</p>
                                      <p>✔ API access</p>
                                    </ul>
                                    <button className="primary-button">Get Started</button>
                                  </div>

                                  {/* Enterprise */}
                                  <div className="app-card">
                                    <h3>Enterprise</h3>
                                    <p>For large-scale projects and custom needs.</p>
                                    <div className="price-block">
                                      <span className="price">Custom</span>
                                    </div>
                                    <ul>
                                      <p>✔ Custom volume of digital twins</p>
                                      <p>✔ Dedicated account manager</p>
                                      <p>✔ On-site support & training</p>
                                      <p>✔ Custom integrations</p>
                                    </ul>
                                    <button
                                      className="secondary-button"
                                      onClick={() =>
                                        document.getElementById("contact-modal")?.classList.remove("hidden")
                                      }
                                    >
                                      Contact Us
                                    </button>
                                  </div>
                                </div>
                            </div>

                         <div className="mt-20">
                             <h2 className="text-xl font-semibold mb-6 text-gray-300">Explore more with a free demo:</h2>
                             <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl animated-gradient-border">
                                 <iframe className="w-full h-full" style={{border: 'none', position: 'absolute', top: 0, left: 0}} src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Hipex Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                             </div>
                         </div>

                     </div>
                </div>
            </div>
        </section>
    );
};

export default HomePage;