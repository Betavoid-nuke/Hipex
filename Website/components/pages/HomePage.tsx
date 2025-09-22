import BackgroundMain from "../Components/Background";

interface HomePageProps {
    onWaitlistClick: () => void;
    onContactClick: () => void;
}

const HomePage = ({ onWaitlistClick, onContactClick }: HomePageProps) => {
    return (
        <section id="home" className="home-section">
          <BackgroundMain />
          <div className="home-content" style={{maxWidth:'-webkit-fill-available', padding:'0px'}}>

            {/* Main Content */}
            <div style={{paddingLeft:'120px', paddingRight:'120px', paddingTop:'40px', paddingBottom:'40px', textAlign:'center'}}>
              {/* Main Heading */}
              <h1 className="home-title" style={{fontSize:'52px'}}>
              Transform video into a <br /><span className="gradient-text">stunning, hyper-realistic Digital Twin.</span>
              </h1>
              <p className="home-subtitle" style={{width:'100%'}}>Twinx is a cutting-edge AI digital twinning platform that converts simple videos into Digital Twins and uses Unreal Engine for AAA-Quality hyper-realism and Pixelcanvas to deliver seamless, web-based metaverse experiences.</p>

              {/* Buttons */}
              <div className="home-buttons">
                    <button onClick={onWaitlistClick} className="primary-button">
                        Join Waitlist
                    </button>
                    <a href="#" onClick={(e) => e.preventDefault()} className="secondary-button">
                        Try Twinx
                    </a>
              </div>
            </div>

            {/* Demo video */}
            <div className="my-8">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-300">Watch our demo:</h2>
                  <div className="w-full flex justify-center">
                    <iframe
                      className="video-iframe w-full max-w-[1920px] h-[750px] md:h-screen"
                      src="https://www.youtube.com/embed/A6GufbxJvQs?autoplay=1&mute=1&loop=1&playlist=A6GufbxJvQs&controls=0&modestbranding=1&showinfo=0&rel=0"
                      title="HypeX Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: "none" }}
                    />
                  </div>
            </div>

            {/* Information */}
            <div style={{paddingLeft:'120px', paddingRight:'120px', marginTop:'100px'}}>
                <div className="my-8">
                    <div id="about">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
                            The Technology Behind <span className="gradient-text">Hipex</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-12" style={{display:'flex', flexWrap:'nowrap', justifyContent:'center', alignItems:'center', rowGap:'20px', flexDirection:'row', gap:'50px'}}>
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-indigo-500 transition-all transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
                                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Digital Twinning</h3>
                                <p className="text-gray-400">Our proprietary artificial intelligence analyzes video footage to automatically reconstruct and convert real-world environments into a precise digital twin.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-purple-500 transition-all transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
                                <h3 className="text-2xl font-bold text-white mb-2">Unreal Engine Hyper-Realism</h3>
                                <p className="text-gray-400">We leverage the power of Unreal Engine to ensure every digital twin is rendered with stunning, photorealistic detail, mirroring the source video with AAA-quality graphics.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-gray-800 shadow-xl border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105" style={{height:'-webkit-fill-available', background:'rgb(65 54 119 / 34%)', border:'none'}}>
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
                                <div className="app-card" style={{background:'rgb(92 32 103 / 44%)', border:'none'}}>
                                  <h3 className="gradient-text" style={{fontSize:'32px'}}>Hobbyist</h3>
                                  <p>For individual creators and enthusiasts.</p>
                                  <div className="price-block">
                                    <span className="price" style={{fontSize:'32px', fontWeight:'bold'}}>$999</span>
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
                                <div className="app-card animated-gradient-border2" style={{background:'rgba(46 32 69)', border:'none', overflow:'visible'}}>
                                  <div
                                    className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full text-white text-xxs font-semibold"
                                    style={{
                                      backgroundColor: "#4b7736ff",
                                      marginTop: '-50px',
                                      zIndex: 1,
                                      color: 'white',
                                      fontSize: '16px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Most Popular
                                  </div>
                                  <h3 className="gradient-text" style={{fontSize:'32px'}}>Professional</h3>
                                  <p>For professionals and small studios.</p>
                                  <div className="price-block">
                                    <span className="price " style={{fontSize:'32px', fontWeight:'bold'}}>$2500</span>
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
                                <div className="app-card" style={{background:'rgb(92 32 103 / 44%)', border:'none'}}>
                                  <h3 className="gradient-text" style={{fontSize:'32px'}}>Enterprise</h3>
                                  <p>For large-scale projects and custom needs.</p>
                                  <div className="price-block">
                                    <span className="price" style={{fontSize:'32px', fontWeight:'bold'}}>Custom</span>
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
                    </div>
                </div>
            </div>
            
          </div>
        </section>
    );
};

export default HomePage;