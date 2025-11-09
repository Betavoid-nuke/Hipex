import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- Type Definitions ---
interface PhotoSliderProps {
  images: string[]; // Expects an array of string URLs
}

// Mock data: Replace these URLs with your actual array of strings (image URLs)
const MOCK_IMAGE_URLS: string[] = [
  "https://placehold.co/1280x720/1e293b/f8fafc?text=Project+View+1",
  "https://placehold.co/1280x720/475569/cbd5e1?text=Wireframe+Snapshot+2",
  "https://placehold.co/1280x720/0f172a/94a3b8?text=Final+Render+3",
  "https://placehold.co/1280x720/334155/f1f5f9?text=Concept+Art+4",
  "https://placehold.co/1280x720/64748b/e2e8f0?text=Model+Showcase+5",
];


/**
 * PhotoSlider Component: Displays a responsive image carousel with navigation.
 * @param {string[]} images - Array of image URLs.
 */
const PhotoSlider: React.FC<PhotoSliderProps> = ({ images }) => {
  // Explicitly type the state as number
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  if (!images || images.length === 0) {
    return (
        <div 
          className="aspect-video rounded-xl shadow-xl overflow-hidden border-4 flex items-center justify-center bg-gray-700"
          style={{borderColor:'#262629'}}
        >
          <p className="text-gray-400">No images available for display.</p>
        </div>
    );
  }

  const numImages = images.length;

  // Move to the next image, wrapping back to the start if needed
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === numImages - 1 ? 0 : prevIndex + 1));
  };

  // Move to the previous image, wrapping back to the end if needed
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? numImages - 1 : prevIndex - 1));
  };

  return (
    // The main container with the user-provided styling
    <div className="relative w-full">
      {/* Image Container */}
      <div
        className="aspect-video rounded-xl shadow-xl overflow-hidden border-4 flex items-center justify-center group relative"
        style={{ borderColor: "#262629" }}
      >
        {/* Current Image */}
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1} of ${numImages}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://placehold.co/1280x720/cc0000/ffffff?text=Image+Load+Failed";
          }}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />

        {/* Overlay for Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            aria-label="Previous image"
            className="p-3 bg-black/60 text-white rounded-full shadow-lg
                       transition-all duration-300 hover:bg-black/80 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 
                       active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            aria-label="Next image"
            className="p-3 bg-black/60 text-white rounded-full shadow-lg
                       transition-all duration-300 hover:bg-black/80 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 
                       active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Dots Below Box */}
      <div className="flex justify-center space-x-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-gray-500/50 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


export default PhotoSlider;