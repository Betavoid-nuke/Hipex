// app/page.tsx

"use client"; // Required for components with hooks

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Tags, Calendar, ArrowDown, ListFilter, X, Plus, Loader2 } from 'lucide-react';
import { MarketplaceProduct } from '@/twinx/types/TwinxTypes';
import ProductDetailView from '@/twinx/components/Marketplace/ProductDetailView';
import ProductCard from '@/twinx/components/Marketplace/ProductCard';
import NewProductModal from '@/twinx/components/Marketplace/NewProductModal';

// --- Mock Data ---
const MOCK_PRODUCTS: MarketplaceProduct[] = [
  { id: 'p1', title: 'Ancient Ruin 3D Kit', description: 'High-quality, modular 3D environment kit.', category: '3D Models', creator: 'Atlas', downloads: 120, createdAt: Date.now() - 86400000 * 3, imageUrl: '', downloadUrl: 'https://mock-cdn.com/ruin-kit.zip' },
  { id: 'p2', title: 'PBR Wood Texture Pack', description: 'A collection of 12 seamless, high-resolution wood textures.', category: 'Textures', creator: 'TexturaPro', downloads: 550, createdAt: Date.now() - 86400000 * 1, imageUrl: '', downloadUrl: 'https://mock-cdn.com/wood-pack.zip' },
  { id: 'p3', title: 'Sci-Fi Sound FX Bundle', description: 'Over 100 futuristic sound effects.', category: 'Audio', creator: 'SynthWave', downloads: 80, createdAt: Date.now() - 86400000 * 7, imageUrl: '', downloadUrl: 'https://mock-cdn.com/scifi-audio.zip' },
  { id: 'p4', title: 'Stylized Water Brush Set', description: 'Custom brush set for Photoshop and Procreate.', category: 'Brushes', creator: 'BrushMaster', downloads: 900, createdAt: Date.now() - 86400000 * 10, imageUrl: '', downloadUrl: 'https://mock-cdn.com/water-brushes.zip' },
  { id: 'p5', title: 'Low-Poly Dragon Model', description: 'A fierce yet low-poly dragon model, fully rigged.', category: '3D Models', creator: 'LowPolyGeek', downloads: 30, createdAt: Date.now() - 86400000 * 2, imageUrl: '', downloadUrl: 'https://mock-cdn.com/lowpoly-dragon.zip' },
  { id: 'p6', title: 'Cracked Earth Texture', description: 'A set of 4k PBR texture maps.', category: 'Textures', creator: 'DirtGen', downloads: 320, createdAt: Date.now() - 86400000 * 5, imageUrl: '', downloadUrl: 'https://mock-cdn.com/cracked-earth.zip' },
];

export default function Home() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);

  const categories = ['All', '3D Models', 'Textures', 'Brushes', 'Audio'];

  // Simulate initial data loading
  useEffect(() => {
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const handleAddProduct = (newProductData: Omit<MarketplaceProduct, 'id' | 'downloads' | 'createdAt' | 'imageUrl' | 'downloadUrl'>) => {
    const newProduct: MarketplaceProduct = {
      ...newProductData,
      id: `p${Date.now()}`, // Generate a unique ID
      downloads: 0,
      createdAt: Date.now(),
      imageUrl: '', // Placeholder
      downloadUrl: 'https://mock-cdn.com/new-asset.zip'
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };
  
  const handleSelectProduct = (product: MarketplaceProduct | undefined) => {
      if (product) {
          setSelectedProduct(product)
      } else {
          setSelectedProduct(null);
      }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    result.sort((a, b) => {
      switch (sortOption) {
        case 'downloads': return b.downloads - a.downloads;
        case 'oldest': return a.createdAt - b.createdAt;
        default: return b.createdAt - a.createdAt;
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

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onClose={handleSelectProduct}
        allProducts={products}
      />
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
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={handleSelectProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-gray-800/50 rounded-xl">
          <h3 className="text-2xl font-bold">No Results Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}

      {isModalOpen && (
        <NewProductModal
          categories={categories.slice(1)}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProduct}
        />
      )}
    </div>
  );
}