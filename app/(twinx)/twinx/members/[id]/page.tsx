
"use client";

import { useEffect, useState } from "react";
import { Search, X, Globe, Briefcase, Tag } from "lucide-react";
import { AppUser } from "@/twinx/types/TwinxTypes";
import dataManager from "@/twinx/data/data";
import { useParams } from "next/navigation";
import { showNotification } from "@/twinx/components/AppNotification";
import UserCard from "@/twinx/components/UserCard";
import AutosuggestFilterInput from "@/twinx/components/AutosuggestFilterInput";

function MembersPagePage() {
  // === STATE VARIABLES (PRESERVED) ===
  const [userId, setUserId] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);

  // === FILTER STATES ===
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("");
  const [filterCompany, setFilterCompany] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const [searchKey, setSearchKey] = useState("");

  // === DATA STATE (This will hold the data fetched from the backend) ===
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  // ===============================================

  // user fetch function
  const fetchAllUsers = async (searchKey?: string) => {
    try {
      const query = searchKey ? `?searchkey=${encodeURIComponent(searchKey)}` : "";
      const res = await fetch(`/api/users/getall${query}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      return [];
    }
  };

  // --- User ID and project fetching ---
  useEffect(() => {
    if (id) {
      setUserId(id);
    }
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        // If you want to support default search, you can pass a search term here
        const users = await fetchAllUsers(); // Fetch all initially
        setAllUsers(users);
        setSearchResults(users);
      } catch (error) {
        console.error("Failed to fetch initial users:", error);
        setAllUsers([]);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    initialFetch();
  }, [id]);

  //gets all the users related to search key
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const query = searchKey ? `?searchkey=${encodeURIComponent(searchKey)}` : "";
        const res = await fetch(`/api/users/getall${query}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setAllUsers(data.users || []);
        setSearchResults(data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Cleanup in case user types fast
    return () => controller.abort();
  }, [searchKey]);

  // --- Re-run search/filter when criteria change ---
  useEffect(() => {
    if (isLoading) return;

    const noFilters =
      !filterCountry.trim() &&
      !filterTag.trim() &&
      !filterCompany.trim() &&
      !searchQuery.trim();

    // 🟢 If no filters, fetch the full list again
    if (noFilters) {
      const initialFetch = async () => {
        setIsLoading(true);
        try {
          // If you want to support default search, you can pass a search term here
          const users = await fetchAllUsers(); // Fetch all initially
          setAllUsers(users);
          setSearchResults(users);
        } catch (error) {
          console.error("Failed to fetch initial users:", error);
          setAllUsers([]);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      initialFetch();
      return;
    }

    // 🔵 Otherwise, filter locally
    let filtered = [...allUsers];

    if (filterCountry.trim()) {
      const countryLower = filterCountry.toLowerCase();
      filtered = filtered.filter(user =>
        user.country?.toLowerCase().includes(countryLower)
      );
    }

    if (filterTag.trim()) {
      const tagLower = filterTag.toLowerCase();
      filtered = filtered.filter(user =>
        user.tags?.some((tag: string) => tag.toLowerCase().includes(tagLower))
      );
    }

    if (filterCompany.trim()) {
      const companyLower = filterCompany.toLowerCase();
      filtered = filtered.filter(user =>
        user.jobs?.some(job =>
          job.company?.toLowerCase().includes(companyLower)
        )
      );
    }

    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.bio?.toLowerCase().includes(searchLower) ||
        user.oneSentanceIntro?.toLowerCase().includes(searchLower) ||
        user.country?.toLowerCase().includes(searchLower) ||
        user.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
        user.jobs?.some(job =>
          job.title?.toLowerCase().includes(searchLower) ||
          job.company?.toLowerCase().includes(searchLower)
        )
      );
    }

    setSearchResults(filtered);
    setAllUsers(filtered);

  }, [filterCountry, filterTag, filterCompany, searchQuery]);



  useEffect(() => {
    if (!isLoading) {
      setSearchKey(searchQuery);
    }
  }, [searchQuery]);

  return (
    <div className="bg-[#1C1C1E] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-['Inter']">
        
      {/* Sleek Search Bar (Always at the top) */}
      <div className="max-w-6xl mx-auto mb-6">
        <form onSubmit={() => setSearchKey(searchQuery)} className="flex">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for name, title, skill, company, or country..."
              className="w-full bg-[#262629] border border-[#3A3A3C] rounded-none px-10 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] transition shadow-md"
            />
            {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A5] hover:text-white"
                >
                  <X size={18} />
                </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Content Area: Filter Bar + Search Results */}
      <div className="max-w-6xl mx-auto flex gap-6">

        {/* LEFT COLUMN: Filter Bar */}
        <div className="w-full md:w-1/4 hidden md:block">
          <div className="bg-[#262629] border border-[#3A3A3C] rounded-none overflow-hidden sticky top-4">
            <div className="p-4 border-b border-[#3A3A3C]">
              <h3 className="text-lg font-bold text-white">Filter Results</h3>
            </div>
            <div className="p-4">
                
                {/* Country Filter - Autosuggest */}
                <AutosuggestFilterInput
                    icon={<Globe size={16} />}
                    label="Country"
                    suggestions={dataManager().allCountries}
                    value={filterCountry}
                    onChange={setFilterCountry}
                />
                
                {/* Skill/Tag Filter - Autosuggest */}
                <AutosuggestFilterInput
                    icon={<Tag size={16} />}
                    label="Skill/Tag"
                    suggestions={dataManager().allSkills}
                    value={filterTag}
                    onChange={setFilterTag}
                />
                
                {/* Company Filter - Simple Input (No Suggestions) */}
                <div className="mb-4">
                    <label className="text-sm font-semibold text-[#A0A0A5] flex items-center gap-2 mb-2">
                        <Briefcase size={16} /> Company
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filterCompany}
                            onChange={(e) => setFilterCompany(e.target.value)}
                            placeholder="Type company name..."
                            className="w-full bg-[#1C1C1E] border border-[#3A3A3C] text-white p-2 focus:outline-none focus:ring-1 focus:ring-[#6366F1] rounded-none"
                        />
                        {filterCompany && (
                            <button 
                                type="button" 
                                onClick={() => setFilterCompany("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] hover:text-white transition"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Search Results */}
        <div className="w-full md:w-3/4">
          <div className="bg-[#262629] border border-[#3A3A3C] rounded-none overflow-hidden">
            <div className="p-4 border-b border-[#3A3A3C]">
              <h3 className="font-bold text-lg text-white">
                {searchQuery || filterCountry || filterTag || filterCompany
                  ? "Filtered Results"
                  : "Top Member Results"}
              </h3>
              <p className="text-sm text-[#A0A0A5]">
                {isLoading || isSearching ? "..." : `${searchResults?.length} ${searchResults?.length === 1 ? 'result' : 'results'} found`}
              </p>
            </div>
            
            <div className="p-0 min-h-[300px]">
              {isLoading || isSearching ? (
                <div className="p-6 text-center">
                    {/* Sleek, lightweight loading text */}
                    <p className="text-[#A0A0A5] text-sm opacity-75">Loading...</p>
                </div>
              ) : searchResults?.length > 0 ? (
                <div className="flex flex-col">
                  {searchResults.map((user) => (
                    <UserCard key={user.id} user={user} currentUserId={userId} />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                    <p className="text-[#A0A0A5]">No members matched your search and filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPagePage;
