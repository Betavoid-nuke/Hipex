import React, { useState, useMemo } from 'react';
import { ArrowDown, Download, Tags, Users } from 'lucide-react';
import DownloadModal from './DownloadModal';
import { MarketplaceProductProduction } from '@/twinx/types/TwinxTypes';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: MarketplaceProductProduction;
  isCompact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, isCompact = false }) => {
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const isNew = useMemo(() => (Date.now() - product.createdAt) < (86400000 * 4), [product.createdAt]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B'];
  const bgColor = colors[0];
  const placeholderText = product.category.split(' ').map(w => w[0]).join('');

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloadModalOpen(true)
    setTimeout(() => setPurchaseMessage(''), 2000);
  };

  if (isCompact) {
    return (
      <div
        className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer flex items-center"
      >
        <div className="w-10 h-10 rounded-md mr-3 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: bgColor }}>
          {placeholderText}
        </div>
        <div className='flex-grow'>
          <p className="text-sm font-semibold text-white truncate">{product.title}</p>
          <p className="text-xs text-gray-400">{product.creator}</p>
        </div>
        <Download size={16} className="text-green-400 ml-2" />
      </div>
    );
  }

  return (
    <>
      <Link href='/twinx/Marketplace/[id]' as={`/twinx/Marketplace/${product._id}`}>
        <div
          className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 flex flex-col relative cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl"
          style={{border:'none', backgroundColor:'#171718'}}
        >
          {purchaseMessage && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 transition-opacity duration-300">
              {purchaseMessage}
            </div>
          )}
          <div
          className="h-40 flex items-center justify-center relative"
          style={{ backgroundColor: bgColor, height: '220px' }}
        >
          {product.imageUrl.length !== 0 && (
          <Image src={product.imageUrl[0]} alt='' width={500} height={100} style={{height:'100%', width:'100%'}} className='object-cover' />
          )}
          {product.imageUrl.length == 0 && (
          <div>No Photos</div>
          )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white leading-tight mr-2 mb-2">{product.title}</h3>
          <p className="text-sm text-gray-400 mb-3 flex-grow" style={{marginTop:'-10px', fontWeight:'lighter', fontSize:'14px'}}>{product.creator}</p>
          <p className="text-sm text-gray-400 mb-3 flex-grow">{product.description.substring(0, 50)}...</p>
          <div className="flex flex-wrap gap-2 text-xs mb-4" style={{marginTop:'20px', marginBottom:'20px'}}>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full flex items-center">
              <Tags size={12} className="mr-1" /> {product.category}
            </span>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full flex items-center">
              <Users size={12} className="mr-1" /> {product.creator}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <span className="text-sm text-gray-500 flex items-center">
              <ArrowDown size={14} className="mr-1 text-indigo-400" /> {product.downloads} Downloads
            </span>
            <button
              onClick={handleDownloadClick}
              className="text-white text-sm font-semibold py-1.5 px-3 rounded-lg hover:bg-green-500 transition-colors flex items-center gap-1"
            >
              <Download size={16} /> Download
            </button>
          </div>
          </div>
        </div>
      </Link>

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <DownloadModal 
          product={product} 
          onClose={() => setIsDownloadModalOpen(false)} 
        />
      )}

    </>
  );
});

export default ProductCard;