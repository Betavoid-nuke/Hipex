import BackgroundMain from "../Components/Background";
import PriceCards from "../Components/PriceCards";
import "../../../app/(root)/globals.css"

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
                    <a href="/twinx" className="secondary-button">
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
                  <PriceCards />
                </div>
            </div>
            
          </div>
        </section>
    );
};

export default HomePage;