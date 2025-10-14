"use client";

import React from "react";
import { Puzzle, Download, BookOpen } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

interface IntegrationsPageProps {
  handleNavigate: (path: string) => void;
}

export default function IntegrationsPage() {

    return (
      <>
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6" style={{marginTop:'40px', marginLeft:'35px'}}>
          <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center gap-3">
            <Puzzle size={28} /> Integrations
          </h2>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 text-white flex flex-col items-center">

          {/* Main Content */}
          <div className="w-full max-w-3xl space-y-8 mx-auto">
            {/* Unreal Engine Plugin Card */}
            <div className="bg-[#171718] rounded-2xl p-8 border border-[#2A2A2C]/50 hover:border-[#3A3A3C] transition-all duration-300 shadow-lg hover:shadow-[#00000033]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Icon */}
                <div className="bg-[#2C2C2E] p-5 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-white opacity-90"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.01 6.42a.57.57 0 0 0-.57-.57H6.42a.57.57 0 0 0-.57.57v5.02a.57.57 0 0 0 .57.57h5.02a.57.57 0 0 0 .57-.57V6.42zM18.15 4.14l-4.14-4.14a.57.57 0 0 0-.81 0l-4.14 4.14a.57.57 0 0 0 0 .81l4.14 4.14a.57.57 0 0 0 .81 0l4.14-4.14a.57.57 0 0 0 0-.81zM12.01 12.58a.57.57 0 0 0-.57.57v5.02a.57.57 0 0 0 .57.57h5.02a.57.57 0 0 0 .57-.57v-5.02a.57.57 0 0 0-.57-.57h-5.02zM5.85 14.86l-4.14 4.14a.57.57 0 0 0 0 .81l4.14 4.14a.57.57 0 0 0 .81 0l4.14-4.14a.57.57 0 0 0 0-.81l-4.14-4.14a.57.57 0 0 0-.81 0z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-white">Unreal Engine 5 Plugin</h3>
                  <p className="text-[#A0A0A5] mt-3 leading-relaxed">
                    Seamlessly import your digital twins directly into your Unreal Engine projects
                    with our official plugin.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8">
                <a
                  href="https://github.com/Betavoid-nuke/TwinX_Unreal5/archive/refs/heads/main.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#6366F1] hover:bg-[#5356e8] transition-all duration-200 text-white font-semibold py-3.5 px-5 rounded-lg text-lg flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Plugin
                </a>
              </div>
            </div>

            {/* Integration Guide Card */}
            <div className="bg-[#171718] rounded-2xl p-8 border border-[#2A2A2C]/50 hover:border-[#3A3A3C] transition-all duration-300 shadow-lg hover:shadow-[#00000033]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Icon */}
                <div className="bg-[#2C2C2E] p-5 rounded-xl flex items-center justify-center">
                  <BookOpen size={80} className="text-white opacity-90" />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-white">Integration Guide</h3>
                  <p className="text-[#A0A0A5] mt-3 leading-relaxed">
                    Our detailed guide provides step-by-step instructions for installing the plugin
                    and using it in your projects.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8">
                <Link href="/twinx/apiguide">
                  <button className="w-full bg-[#3A3A3C] hover:bg-[#4A4A4C] transition-all duration-200 text-white font-semibold py-3.5 px-5 rounded-lg text-lg flex items-center justify-center gap-2">
                    <BookOpen size={20} /> View Guide
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </>
    );
};
