// app/page.tsx

"use client"; // Required for components with hooks

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Tags, Calendar, ArrowDown, ListFilter, X, Plus, Loader2 } from 'lucide-react';
import ProductDetailView from '@/twinx/components/Marketplace/ProductDetailView';
import ProductCard from '@/twinx/components/Marketplace/ProductCard';
import NewProductModal from '@/twinx/components/Marketplace/NewProductModal';
import { AnimatePresence, motion } from "framer-motion";
import DownloadModal from '@/twinx/components/Marketplace/DownloadModal';
import { MarketplaceProductProduction } from '@/twinx/types/TwinxTypes';
import { useUser } from '@clerk/nextjs';
import { getUserById } from '@/twinx/utils/twinxDBUtils.action';
import { AppUser } from '@/Website/Marketplace/types';
import { useParams } from 'next/navigation';

export default function Home() {
  const [products, setProducts] = useState<MarketplaceProductProduction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', '3D Models', 'Textures', 'Brushes', 'Audio'];

  // Fetch user data ___________________________________
  const { user } = useUser();
  const [fetchedUser, setfetchedUser] = useState<AppUser>();
  const [userId, setUserId] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string | null;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const fetchedUser = await getUserById(user.id);
        setfetchedUser(fetchedUser)
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      }
    };
    fetchData();
    
  }, [userId]);
  
  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);
  // Fetch user data __________________________________________

  // Fetch all listed assets
  async function fetchProducts() {
    try {
      const res = await fetch("/api/marketplace", { cache: "no-store" });
      const data = await res.json();
  
      if (res.ok) {
        const filteredProducts = Array.isArray(data.data)
          ? data.data.filter(
              (product: any) => product.creatorid === fetchedUser?.id
            )
          : [];
          
        setProducts(filteredProducts);
          
      } else {
        console.error("❌ Failed to fetch products:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Network error while fetching products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchProducts();
  }, []);

  //esc to close new project model
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Filtered & Sorted Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...(products ?? [])]; // ✅ prevents undefined & clones array safely

    if (searchTerm) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "downloads":
          return b.downloads - a.downloads;
        case "oldest":
          return a.createdAt - b.createdAt;
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor:'#1c1c1e'}}>
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="ml-3 text-white">Loading Marketplace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-8" style={{backgroundColor:'#1c1c1e'}}>
      
      <div className="bg-gray-800/50 p-4 rounded-xl mb-8" style={{backgroundColor:'#1c1c1e'}}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{backgroundColor:'#262629', borderColor:'#4b4b52ff'}} className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-2.5" />
          </div>
          <div className="relative">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{backgroundColor:'#262629', borderColor:'#4b4b52ff'}} className="appearance-none bg-gray-700 rounded-lg px-4 py-2.5 pr-10">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ArrowDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{backgroundColor:'#262629', borderColor:'#4b4b52ff'}} className="appearance-none bg-gray-700 rounded-lg px-4 py-2.5 pr-10">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="downloads">Most Downloaded</option>
            </select>
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-500 flex items-center justify-center gap-2">
            <Plus size={20} /> Upload Asset
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-5">Showing {filteredAndSortedProducts.length} Results</h2>
      
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-gray-800/50 rounded-xl">
          <h3 className="text-2xl font-bold">No Results Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full max-w-3xl rounded-2xl p-6
                backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                [box-shadow:inset_0_0_0.5px_rgba(255,255,255,0.4)]
              "
            >
              <NewProductModal
                categories={categories.slice(1)}
                onClose={() => setIsModalOpen(false)}
                refreshProducts={fetchProducts}
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}