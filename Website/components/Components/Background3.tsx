export default function BackgroundMain3() {
    return (
        <>
            {/* <div className="backdropblur" style={{zIndex:'1', height:'100%', widows:'100%'}}></div> */}
            <div className="min-h-screen w-full relative bg-black" style={{position:'absolute', top:'0', left:'0', right:'0', bottom:'0', zIndex:'0', overflow:'hidden'}}>
              {/* Prismatic Aurora Burst - Multi-layered Gradient */}
              <div className="min-h-screen w-full relative">
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    background:
                      "radial-gradient(circle at top, #1c1f36ff, #000000)",
                  }}
                />
              </div>
            </div>
        </>
    )
}