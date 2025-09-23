"use client";

import { hipexAppsData } from '@/Website/data/hipexAppsData';
import Image from 'next/image';
import AppCards from '../Components/AppCards';
import BackgroundMain2 from '../Components/Background2';

const HipexAppsPage = () => {

    const shareApp = (appName: string, text: string) => {
        if (navigator.share) {
            navigator.share({
                title: appName,
                text: text,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('URL copied to clipboard!');
            });
        }
    };

    return (
        <section id="hipex-apps" className="page pt-32 pb-24" style={{display:'block', marginTop:'-120px'}}>
            <BackgroundMain2 />
            <div className="hipex-apps-container" style={{zIndex:'2', position:'relative'}}>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Explore Our <span className="gradient-text">Apps</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12" style={{marginBottom:'120px'}}>
                    Discover the growing ecosystem of applications built on the Hipex platform, from AI-powered creation tools to immersive web experiences.
                </p>
                
                <div id="hipex-apps-listings" className="apps-grid">
                    {hipexAppsData.map((app, index) => (
                        <AppCards app={app} index={index} shareApp={shareApp} key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HipexAppsPage;