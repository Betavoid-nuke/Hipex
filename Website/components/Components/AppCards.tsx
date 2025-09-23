import Image from "next/image";


interface app {
    name: string;
    description: string;
    image: string;
    youtubeLink: string;
    activeUsers: string;
    info: string[];
    href: string;
}


export default function AppCards({app, index, shareApp}: {app: app, index: number, shareApp: (appName: string, text: string) => void}) {
    return (
        <div key={index} className="app-card" style={{border:'none', boxShadow:'0 4px 30px rgb(0 0 0 / 10%)', backdropFilter:'blur(5px)', WebkitBackdropFilter:'blur(5px)'}}>
            <div className="app-image-wrapper">
                <Image src={app.image} alt={app.name} layout="fill" objectFit="cover" />
            </div>
            <div className="app-info" style={{padding:'2rem', marginTop:'-60px'}}>
                <h3 className="app-title">{app.name}</h3>
                <p className="app-description" style={{marginBottom:'30px'}}>{app.description}</p>
                <a href={app.href} className="app-launch-button" style={{fontSize:'16px'}}>
                    Launch App
                </a>
            </div>
        </div>
    )
}