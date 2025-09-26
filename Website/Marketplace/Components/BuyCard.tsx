'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Product } from '../types'; // Adjust path as needed
import RatingStars from './RatingStarSystem';

// Types
interface BaseItem {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  isAnimated: boolean;
  isDownloadable: boolean;
  date: Date;
  likes: number;
  isFavorite: boolean;
  rating?: number;
  reviews?: number;
  technicalInfo?: { label: string; value: string }[];
  downloadFormats?: { format: string; size: string; downloadUrl: string }[];
  comments?: { user: string; comment: string; date: Date }[];
  photos?: string[];
}

interface BuyCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: () => void;
  rating: number;
  reviews: string;
  twin: BaseItem;
}

let externalDisableAddBtn: ((disable: boolean) => void) | null = null;
export function exthandleDisableAddBtn(disable: boolean) {
  if (externalDisableAddBtn) {
    externalDisableAddBtn(disable);
  } else {
    console.warn("exthandleAddToCart called before BuyAndCart mounted");
  }
}


const BuyCard: React.FC<BuyCardProps> = ({ product, onAddToCart, onBuyNow, rating, reviews, twin }) => {

  const [IsProductInCart, setIsProductInCart] = useState<boolean>(false);

  const handleDisableAddToCart = useCallback((disable: boolean) => {
    setIsProductInCart(disable);
  }, []);
  // Expose externalhandleAddToCart for outside use
  useEffect(() => {
    externalDisableAddBtn = handleDisableAddToCart;
    return () => {
      externalDisableAddBtn = null;
    };
  }, [handleDisableAddToCart]);



  return (
    <div className="commerce-section" style={{backgroundColor:'rgb(21 27 45)'}}>
        
      <h3 className="marketplace-title" style={{fontSize:'32px'}}>{twin.title}</h3>
      <p className="marketplace-author" style={{fontSize:'16px', marginBottom:'10px'}}>{twin.author}</p>
      <div className="flex justify-between items-center mb-4" style={{marginBottom:'40px'}}>
          <span className="text-3xl font-extrabold text-white">${twin.price}</span>
      </div>
      <div className="flex items-center gap-1 my-2">
        <RatingStars rating={rating} />
        <span className="text-sm text-gray-400 ml-1">{rating}</span>
        <span className="text-sm text-gray-500 ml-1">({reviews})</span>
      </div>
      <div style={{marginBottom:'30px'}}></div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={onBuyNow} className="marketplace-buy-btn">
          Buy Now
        </button>
        <button
          onClick={() => onAddToCart(product)}
          className="add-to-cart-btn"
          disabled={IsProductInCart}
          style={{ opacity: IsProductInCart ? 0.5 : 1, cursor: IsProductInCart ? 'not-allowed' : 'pointer' }}
        >
          {IsProductInCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default BuyCard;