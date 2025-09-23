
export default function PriceCards() {
    return (
        <div id="pricing">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Flexible <span className="gradient-text">Subscription Plans</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">Choose the plan that fits your needs, from a hobbyist to a professional studio.</p>
            <div className="container">
                <div className="apps-grid">
                  {/* Hobbyist */}
                  <div className="app-card" style={{background:'rgb(92 32 103 / 44%)', border:'none', justifyContent:'space-between', height:'600px'}}>
                        <h3 className="gradient-text" style={{fontSize:'32px', marginTop:'40px'}}>Hobbyist</h3>
                        <p>For individual creators and enthusiasts.</p>
                        <div className="price-block">
                          <span className="price" style={{fontSize:'32px', fontWeight:'bold'}}>$499</span>
                          <span className="per">/month</span>
                        </div>
                        <div style={{marginTop:'-30px', fontSize:'14px'}}>
                          <span className="price" style={{fontSize:'18px'}}>10 Credit </span>
                          <span className="per">/ 1 dollar</span>
                        </div>
                        <ul>
                          <p>✔ 5,000 Credits</p>
                          <p>✔ Standard generation speed</p>
                          <p>✔ Basic support</p>
                        </ul>
                        <button className="primary-button" style={{marginBottom:'40px'}}>Get Started</button>
                  </div>
                  {/* Professional */}
                  <div className="app-card animated-gradient-border2" style={{background:'rgba(46 32 69)', border:'none', overflow:'visible', justifyContent:'space-between', height:'600px'}}>
                        <div
                          className="absolute inset-1/2 px-4 py-2 rounded-full text-white text-xxs font-semibold"
                          style={{
                            backgroundColor: "#4b7736ff",
                            marginTop: '-20px',
                            zIndex: 1,
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                          }}
                        >
                          Most Popular
                        </div>
                        <h3 className="gradient-text" style={{fontSize:'32px', marginTop:'40px'}}>Professional</h3>
                        <p>For professionals and small studios.</p>
                        <div className="price-block">
                          <span className="price " style={{fontSize:'32px', fontWeight:'bold'}}>$1499</span>
                          <span className="per">/month</span>
                        </div>
                        <div className="price-block" style={{marginTop:'-30px', fontSize:'14px'}}>
                          <span className="price ">14 Credit </span>
                          <span className="per">/ 1 dollar</span>
                        </div>
                        <ul>
                          <p>✔ 20,000 Credits</p>
                          <p>✔ High-priority generation</p>
                          <p>✔ Premium support</p>
                          <p>✔ API access</p>
                        </ul>
                        <button className="primary-button" style={{marginBottom:'40px'}}>Get Started</button>
                  </div>
                  {/* Enterprise */}
                  <div className="app-card" style={{background:'rgb(92 32 103 / 44%)', border:'none', justifyContent:'space-between', height:'600px'}}>
                        <h3 className="gradient-text" style={{fontSize:'32px', marginTop:'40px'}}>Enterprise</h3>
                        <p>For large-scale projects and custom needs.</p>
                        <div className="price-block">
                          <span className="price" style={{fontSize:'32px', fontWeight:'bold'}}>Custom</span>
                        </div>
                        <ul>
                          <p>✔ Custom volume of credits</p>
                          <p>✔ Dedicated account manager</p>
                          <p>✔ On-site support & training</p>
                          <p>✔ Custom integrations</p>
                        </ul>
                        <button
                          className="secondary-button"
                          onClick={() =>
                            document.getElementById("contact-modal")?.classList.remove("hidden")
                          }
                          style={{marginBottom:'40px'}}
                        >
                          Contact Us
                        </button>
                  </div>
                  
                </div>
            </div>
        </div>
    )
}