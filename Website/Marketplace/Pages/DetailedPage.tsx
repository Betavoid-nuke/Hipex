import React, { useState, useMemo, FormEvent } from "react";
import MarketplaceCard from "../Components/MarketplaceCard";
import { assetsJson, marketplaceListingsJson, myListedTwinsJson } from "../Data/Data";
import PhotoViewer from "../Components/PhotoViewer";
import DownloadModal from "../Components/DownloadModel";
import "../../../app/(twinx)/globals.css";
import RatingStars from "../Components/RatingStarSystem";
import { Product } from "../types";
import { BsCart2 } from "react-icons/bs";
import MarketplaceCart from "../Components/BuyCart";
import CheckoutModal from "../Components/CheckoutModal";
import "../Styling/buyandcart.css"
import BuyCard from "../Components/BuyCard";

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

interface TechnicalInfo {
  label: string;
  value: string;
}

interface Comment {
  user: string; comment: string; date: Date
}

interface DownloadFormat {
  format: string;
  size: string;
  downloadUrl: string;
}

interface Twin {
  id: string;
  title: string;
  description: string;
  author: string;
  rating: number;
  reviews: number;
  category: string;
  photos: string[];
  technicalInfo: TechnicalInfo[];
  comments: Comment[];
  downloadFormats?: DownloadFormat[];
}

interface DetailedViewProps {
  twin: BaseItem;
  userId: string;
  onBack: () => void;
  onFavoriteToggle: (id: string) => void;
  onSelectTwin: (twin: BaseItem) => void;
  onCommentAdded: (twinId: string, newComment: { user: string; comment: string; date: Date }) => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({
  twin,
  onBack,
  onFavoriteToggle,
  onSelectTwin,
  userId,
  onCommentAdded,
}) => {

  const [newComment, setNewComment] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Use a unique profile image for the current user
  const userProfileImage ="https://placehold.co/40x40/1f2937/d1d5db?text=You";
  const user = { userId, profileImage: userProfileImage };

  const allItems = useMemo(
    () => [
      ...marketplaceListingsJson,
      ...assetsJson,
      ...myListedTwinsJson,
    ],
    []
  );

  // Logic for similar items
  const similarItems = useMemo(() => {
    let itemsByCat = allItems.filter(
      (item) => item.id !== twin.id && item.category === twin.category
    );
    if (itemsByCat.length === 0) {
      // Fallback: get any 4 other items if no similar ones are found
      itemsByCat = allItems
        .filter((item) => item.id !== twin.id)
        .sort(() => 0.5 - Math.random());
    }
    return itemsByCat.slice(0, 4);
  }, [twin, allItems]);

  // Function to add a new comment to the local state
  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObject: Comment = {
      user: user.userId,
      comment: newComment,
      date: new Date(),
    };

    onCommentAdded(twin.id, newCommentObject);
    setNewComment("");
  };

  const rating = twin.rating || 0;
  const reviews = twin.reviews || 0;






  // BUY AND CART FUNCTIONALITIES -----------------------------------------------
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This is your product data. In a real app, this would likely come from an API.
  const product: Product = {
    id: 'prod_12345',
    title: 'Awesome Product',
    description: 'A digital download for an awesome product.',
    author: 'AI Creator',
    price: 29.99,
    image: 'https://placehold.co/600x400/17151f/A0A0A5?text=Awesome+Product',
    category: 'Digital',
    thumbnail: 'https://placehold.co/100x100/17151f/A0A0A5?text=Product'
  };

  const handleAddToCart = (productToAdd: Product) => {
    // Prevent adding the same product multiple times
    if (!cart.find(item => item.id === productToAdd.id)) {
      setCart(prevCart => [...prevCart, productToAdd]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleBuyNow = () => {
    // If the item isn't in the cart, add it before opening the modal
    if (!cart.find(item => item.id === product.id)) {
      setCart([product]);
    }
    setIsCartOpen(false);
    setIsModalOpen(true);
  };
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    setCart([]); // Clear the cart after successful payment
    alert('Payment successful! (Simulated)');
  };
  
  const isProductInCart = cart.some(item => item.id === product.id);





  return ( 
    <div className="p-4 sm:p-6 lg:p-8 text-white" style={{backgroundColor:'transparent'}}>
      <div className="max-w-7xl mx-auto">

        {/* Top section */}
        <div style={{display:'flex', flexDirection:'row', marginBottom:'20px', justifyContent:'space-between'}}>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="test flex items-center gap-2 text-[#A0A0A5] hover:text-white mb-6"
            style={{margin:'0px'}}
          >
            <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
            </svg>
            Back to Marketplace
          </button>













          {/* move this to the marketplace page so the cart information is persistent */}


          {/* Cart Icon */}
          <button onClick={() => setIsCartOpen(true)} className="cart-icon" style={{backgroundColor:'#6366f1'}}>
              {/* You can add your cart icon here, e.g., from a library like react-icons */}
              <BsCart2 size={22} />
              {cart.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
              )}
          </button>














        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side (Details) */}
          <div className="flex-grow" style={{marginLeft:'50px', marginRight:'50px'}}>

            <div className="bg-[#262629] rounded-xl overflow-hidden aspect-video">
              <PhotoViewer photos={twin.photos} />
            </div>

            {/* Technical details */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {twin.title}
                </h1>
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="download-asset-btn"
                  disabled={true}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Download
                </button>
              </div>
              <p className="text-lg text-[#A0A0A5] mb-4">by {twin.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-400 ml-1">
                  {rating}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({reviews})
                </span>
              </div>

              <p className="text-[#A0A0A5] mt-4">{twin.description}</p>

              {/* Technical Info */}
              <div className="mt-6" style={{backgroundColor:'#10121f'}}>
                <details className="technical-details" style={{backgroundColor:'#10121f', border:'none'}} open>

                  <summary className="technical-details-summary" style={{backgroundColor:'#10121f'}}>
                    Technical Information
                    <svg
                      className="technical-details-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </summary>

                  <table className="technical-details-table" style={{backgroundColor:'#10121f'}}>
                    <tbody>
                      {twin.technicalInfo?.map((info, i) => (
                        <tr key={i}>
                          <td className="technical-details-label">
                            {info.label}
                          </td>
                          <td className="technical-details-value">
                            {info.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </details>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-8 border-t border-[#3A3A3C] pt-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {twin.comments?.length} Comments
              </h3>

              <form
                onSubmit={handleAddComment}
                className="flex items-start gap-4 mb-8"
              >
                <img
                  src={userProfileImage}
                  alt="User"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-grow border-b border-[#3A3A3C] focus-within:border-white transition-colors duration-300">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a public comment..."
                    className="w-full bg-transparent border-none text-white focus:outline-none py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className={`bg-[#6366F1] text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 ${
                    !newComment.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-opacity-90"
                  }`}
                >
                  Comment
                </button>
              </form>

              <div className="space-y-6">
                {twin.comments?.map((comment) => (
                  <div key={comment.comment} className="flex items-start gap-4">
                    <img
                      src="https://placehold.co/40x40/1f2937/d1d5db?text=U"
                      alt="User"
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {comment.user}{" "}
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-300 mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))}
                {twin.comments?.length === 0 && (
                  <div className="text-center py-4 text-[#A0A0A5]">
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side (Similar Items and Buy now card) */}
          <div className="w-full lg:w-1/4" style={{width:'25%', marginRight:'20px'}}>

            <BuyCard 
              product={product} 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isProductInCart={isProductInCart}
              rating={rating}
              reviews={reviews.toString()}
              twin={twin}
            />

            <h3 className="text-2xl font-bold text-white mb-4" style={{fontSize:'18px', fontWeight:'lighter'}}>
              Similar Assets
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {similarItems.length > 0 ? (
                similarItems.map((item) => (
                  <MarketplaceCard
                    key={item.id}
                    item={item}
                    onFavoriteToggle={onFavoriteToggle}
                    onSelect={onSelectTwin}
                  />
                ))
              ) : (
                <p className="text-[#A0A0A5]">No similar assets found.</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {showDownloadModal && (
        <DownloadModal
          twin={twin}
          onClose={() => setShowDownloadModal(false)}
        />
      )}


      <MarketplaceCart 
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
      
      <CheckoutModal 
        isOpen={isModalOpen}
        cartItems={cart}
        onClose={() => setIsModalOpen(false)}
        onPaymentSubmit={handlePaymentSuccess}
      />

    </div>
  );
};

export default DetailedView;
