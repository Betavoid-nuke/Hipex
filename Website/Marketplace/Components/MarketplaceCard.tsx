import React, { FC } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import RatingStars from "./RatingStarSystem";

// --- Data Model Interfaces ---
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

interface MarketplaceCardProps {
  item: BaseItem;
  onFavoriteToggle: (id: string) => void;
  onSelect: (item: BaseItem) => void;
}

const MarketplaceCard: FC<MarketplaceCardProps> = ({ item, onFavoriteToggle, onSelect }) => {
  const rating = item.rating || 0;
  const reviews = item.reviews || 0;

  return (
    <div className="marketplace-card" onClick={() => onSelect(item)} style={{backgroundColor:'#10121f', border:'none'}}>
            <div className="marketplace-image-container">
                <img src={item.image} alt={item.title} className="marketplace-image" />
                <button
                    className="marketplace-favorite-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(item.id);
                    }}
                >
                    <svg className={`w-5 h-5 transition-transform duration-300 ${item.isFavorite ? 'text-red-500' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                        {item.isFavorite ? (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.48 5.48 0 017.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.48 5.48 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        ) : (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.48 5.48 0 017.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.48 5.48 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none" />
                        )}
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <h3 className="marketplace-title">{item.title}</h3>
                <p className="marketplace-author">{item.author}</p>
                <div className="flex items-center gap-1 my-2">
                  <RatingStars rating={rating} />
                  <span className="text-sm text-gray-400 ml-1">{rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({reviews})</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-white">${item.price}</p>
                    <button className="marketplace-buy-btn">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
  );
};

export default MarketplaceCard;
