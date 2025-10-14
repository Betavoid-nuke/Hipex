"use client";

import { useMemo, useState } from "react";
import { List, LucideProps, Search } from "lucide-react";
import { Project } from "@/twinx/types/TwinxTypes";
import { Timestamp } from "firebase/firestore";

interface templates {
  title: string;
  icon: React.ComponentType<LucideProps>;
}

export default function templates() {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');
  const [sort, setSort] = useState<string>('date_desc');

  return (
    <div className="p-8 text-white">

      {/* 🟣 DASHBOARD HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center gap-3">
          <List size={28} /> Templates
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A5]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-full sm:w-48"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              <option value="All">All</option>
              <option value="Favorites">Favorites</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </header>

      {/* 🟣 TEMPLATES GRID */}
      <div className="bg-transparent border border-[#3A3A3C] rounded-lg p-16 text-center text-[#A0A0A5] flex flex-col items-center justify-center space-y-4" style={{backgroundColor:'transparent', border:'none'}}>
        <h2 className="text-2xl font-semibold text-white tracking-wide">Templates Incoming</h2>
        <p className="max-w-md text-[#A0A0A5]">
          Get ready to explore a curated collection of <span className="text-white font-medium">AAA-quality</span> assets — all free to use.  
          Our creators are crafting something extraordinary.
        </p>
        <div className="mt-4 px-6 py-2 bg-[#3A3A3C] rounded-full text-sm text-white border border-[#4A4A4D] animate-pulse">
          Launching Soon ⏳
        </div>
      </div>

    </div>
  );
  
};

