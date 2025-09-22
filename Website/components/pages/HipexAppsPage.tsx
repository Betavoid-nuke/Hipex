"use client";


import { hipexAppsData } from '@/Website/data/hipexAppsData';
import Image from 'next/image';

const HipexAppsPage = () => {
    // ... shareApp function from previous example ...

    return (
        <section id="hipex-apps" className="page" style={{ display: 'block' }}>
            <div className="hipex-apps-container">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Explore Our <span className="gradient-text">Apps</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
                    Discover the growing ecosystem of applications built on the Hipex platform...
                </p>
                
                <div id="hipex-apps-listings" className="apps-grid">
                    {hipexAppsData.map((app, index) => (
                        <div key={index} className="app-card">
                            <div className="app-image-wrapper">
                                <Image src={app.image} alt={app.name} layout="fill" objectFit="cover" />
                                {/* ... YouTube link overlay ... */}
                            </div>
                            <div className="app-info">
                                <h3 className="app-title">{app.name}</h3>
                                <p className="app-description">{app.description}</p>
                                <ul className="app-info-list mb-4 space-y-2">
                                    {app.info.map((item, i) => (
                                        <li key={i}><span>{item}</span></li>
                                    ))}
                                </ul>
                                {/* ... user count, share button, launch button ... */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HipexAppsPage;