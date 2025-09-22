
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
                            marginTop: '-20px',
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
    )
}