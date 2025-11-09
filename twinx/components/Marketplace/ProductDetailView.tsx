"use client";

import React, { useState, useMemo, useEffect } from 'react';
import DownloadModal from './DownloadModal';
import DetailTabs from './DetailTabs';
import ProductCard from './ProductCard';
import { 
  ArrowLeft, Clock, Download, FileText, GitFork, Tags, TrendingUp 
} from 'lucide-react';
import { MarketplaceProductProduction } from '@/twinx/types/TwinxTypes';
import PhotoSlider from '../PhotoSlider';
import CommentSection from './CommentSection';

interface ProductDetailViewProps {
  product: MarketplaceProductProduction;
  allProducts: MarketplaceProductProduction[];
  onClose: (product?: MarketplaceProductProduction) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, allProducts, onClose }) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imagesToShow, setimagesToShow] = useState(['']);
  const recommendedAssets = useMemo(() => {
    return allProducts
      .filter(p => p.category === product.category && p._id !== product._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [product, allProducts]);

  const formattedDate = useMemo(() => {
    return new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }, [product.createdAt]);

  // Load the images when they come from Mongo
  useEffect(() => {
    const imageData = product?.imageUrl as unknown;

    if (!imageData) return;

    let urlsArray: string[] = [];

    if (Array.isArray(imageData)) {
      urlsArray = imageData as string[];
    } else if (typeof imageData === "string") {
      urlsArray = imageData
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
    }

    setimagesToShow(urlsArray);
  }, [product.imageUrl]);

  // --- Tab Content (unchanged functional logic, just visual restyle) ---
  const TabContent = () => {
    switch (activeTab) {
        case 'description':
            return (
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                </div>
            );
        case 'details':
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
                        <p className="text-gray-400 flex items-center mb-1"><Tags size={14} className="mr-1 text-pink-400" /> Category</p>
                        <p className="text-white font-semibold">{product.category}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
                        <p className="text-gray-400 flex items-center mb-1"><Clock size={14} className="mr-1 text-pink-400" /> Uploaded Date</p>
                        <p className="text-white font-semibold">{formattedDate}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
                        <p className="text-gray-400 flex items-center mb-1"><TrendingUp size={14} className="mr-1 text-pink-400" /> Total Downloads</p>
                        <p className="text-white font-semibold">{product.downloads}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
                        <p className="text-gray-400 flex items-center mb-1"><GitFork size={14} className="mr-1 text-pink-400" /> License</p>
                        <p className="text-white font-semibold">CC BY 4.0</p>
                    </div>
                    <div className="p-3 rounded-lg col-span-2" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
                        <p className="text-gray-400 flex items-center mb-1"><FileText size={14} className="mr-1 text-pink-400" /> File Size (Mock)</p>
                        <p className="text-white font-semibold">Approx. {Math.round(Math.random() * 500) + 50} MB</p>
                    </div>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{backgroundColor:'#1c1c1e'}}>

      {/* Top Bar */}
      <div className='mb-6 flex justify-between items-center'>
        <button
          onClick={() => onClose()} 
          className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors rounded-lg px-3 py-2"
          style={{background:'transparent', border:'none'}}
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Marketplace
        </button>
        <span className="text-sm text-gray-500">Uploaded: {formattedDate}</span>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT/CENTER */}
        <div className="lg:col-span-2 space-y-6">

          {/* 3D Viewer */}
            <PhotoSlider images={imagesToShow} />

           {/* Header Card */}
          <div className="p-6 rounded-xl shadow-lg" style={{background:'transparent', border:'none', marginBottom:'-30px', marginTop:'0px'}}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{product.title}</h1>
                <p className="text-md text-gray-400">
                  By <span className="text-indigo-400 font-medium">{product.creator}</span>
                </p>
              </div>

              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="bg-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 whitespace-nowrap"
              >
                <Download size={20} /> Free Download
              </button>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="p-6 rounded-xl shadow-lg" style={{background:'#262629', border:'1px solid #4b4b52ff'}}>
            <DetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4">
              <TabContent />
            </div>
          </div>

          {/* comment section */}
          <CommentSection productId={product._id} />

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl shadow-lg sticky top-4"
            style={{background:'#262629', border:'1px solid #4b4b52ff'}}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 pb-3"
              style={{borderBottom:'1px solid #4b4b52ff'}}
            >
              <TrendingUp size={20} className="text-indigo-400" /> More from {product.creator}
            </h3>

            <div className="space-y-4">
              {recommendedAssets.length > 0 ? (
                recommendedAssets.map(rec => (
                  <ProductCard 
                    key={rec._id} 
                    product={rec} 
                    onSelectProduct={() => onClose(rec)} 
                    isCompact={true} 
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No other assets found in this category from this creator.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <DownloadModal 
          product={product} 
          onClose={() => setIsDownloadModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetailView;
