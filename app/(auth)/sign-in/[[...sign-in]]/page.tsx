"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import projectInfo from "../../../../CustomizingPlatform/information.json";
 import { dark } from "@clerk/themes";

// Dynamically import SignIn without SSR
const SignIn = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignIn), {
  ssr: false,
  loading: () => <div className="text-white">Loading sign-in...</div>,
});

export default function Page() {
  const gradientColors = projectInfo.colors.join(", ");
  const showLogo = projectInfo.showLogoOnSigninPage;

  type BallProps = {
    color: string;
    i: string;
    d: string;
  };
  
  const balls: BallProps[] = [
    { color: '#ff6347', i: '12px', d: '3.4s' },
    { color: '#00ced1', i: '18px', d: '6.1s' },
    { color: '#adff2f', i: '10px', d: '2.9s' },
    { color: '#9370db', i: '16px', d: '7.8s' },
    { color: '#ff1493', i: '14px', d: '4.6s' },
    { color: '#00bfff', i: '11px', d: '3.3s' },
    { color: '#7fff00', i: '17px', d: '5.5s' },
    { color: '#dc143c', i: '13px', d: '6.7s' },
    { color: '#8a2be2', i: '19px', d: '8.2s' },
    { color: '#48d1cc', i: '15px', d: '9.1s' },
    { color: '#ff4500', i: '14px', d: '4.2s' },
    { color: '#00ff7f', i: '16px', d: '5.8s' },
    { color: '#ba55d3', i: '10px', d: '7.3s' },
    { color: '#1e90ff', i: '18px', d: '6.4s' },
    { color: '#ffa500', i: '20px', d: '10s' },
    { color: '#ff69b4', i: '12px', d: '3.7s' },
    { color: '#00fa9a', i: '11px', d: '2.6s' },
    { color: '#9400d3', i: '17px', d: '6.9s' },
    { color: '#ffb6c1', i: '13px', d: '5.3s' },
    { color: '#20b2aa', i: '19px', d: '7.7s' },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-75 animate-gradient"
        style={{
          background: `black`,
          backgroundSize: "300% 300%",
          zIndex:'0'
        }}
      />

      <aside className="container-loader" style={{zIndex:'-1'}}>
        {balls.map((ball, index) => (
          <article
            key={index}
            className="ball"
            style={
              {
                '--color': ball.color,
                '--i': ball.i,
                '--d': ball.d,
              } as React.CSSProperties
            }
          />
        ))}
      </aside>


      {/* Centered container with glass effect */}
      <div className="flex items-center justify-center h-full" style={{zIndex:'99'}}>
        <div className="glasscard relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-12 w-full max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4">
            {showLogo && (
              <Image
                src="/logo.png"
                width={64}
                height={64}
                alt="Logo"
                className="mb-2"
              />
            )}
            <span className="font-semibold text-white text-center" style={{fontSize:'36px', marginTop:'-25px'}}>
              {projectInfo.name}
            </span>
            <SignIn 
              appearance={{
                baseTheme: dark,
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
