import "./comingsoon.css"
export default function Comingsoon() {
    
    return(
        <>
            <div className="main-container">
              <div className="loader">
                <svg
                  viewBox="0 0 900 900"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  style={{width:'100%',marginTop:'-300px'}}
                >
                  <defs>
                    <linearGradient
                      id="traceGradient1"
                      x1="250"
                      y1="120"
                      x2="100"
                      y2="200"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
                    </linearGradient>

                    <linearGradient
                      id="traceGradient2"
                      x1="650"
                      y1="120"
                      x2="800"
                      y2="300"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
                    </linearGradient>

                    <linearGradient
                      id="traceGradient3"
                      x1="250"
                      y1="380"
                      x2="400"
                      y2="400"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
                    </linearGradient>

                    <linearGradient
                      id="traceGradient4"
                      x1="650"
                      y1="120"
                      x2="500"
                      y2="100"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  
                  <g id="browser" transform="translate(0, 200)">
                    <rect
                      x="250"
                      y="120"
                      width="400"
                      height="260"
                      rx="8"
                      ry="8"
                      className="browser-frame"
                    />
                    <rect
                      x="250"
                      y="120"
                      width="400"
                      height="30"
                      rx="8"
                      ry="8"
                      className="browser-top"
                    />
                    <text x="294" y="140" textAnchor="middle" className="loading-text">
                      Loading...
                    </text>
                    <rect x="270" y="160" width="360" height="20" className="skeleton" />
                    <rect x="270" y="190" width="200" height="15" className="skeleton" />
                    <rect x="270" y="215" width="300" height="15" className="skeleton" />
                    <rect x="270" y="240" width="360" height="90" className="skeleton" />
                    <rect x="270" y="340" width="180" height="20" className="skeleton" />
                  </g>
                  
                  <g id="traces" transform="translate(0, 200)">
                    <path d="M100 300 H250 V120" className="trace-flow" />
                    <path d="M800 200 H650 V380" className="trace-flow" />
                    <path d="M400 520 V380 H250" className="trace-flow" />
                    <path d="M500 50 V120 H650" className="trace-flow" />
                  </g>
                </svg>
              </div>
            </div>
        </>
    )
}