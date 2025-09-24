import { useState } from "react";

const PhotoViewer = ({ photos }: { photos: string[] | undefined }) => {

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-[#262629] text-gray-500 rounded-xl">
        <span>No photos available</span>
      </div>
    );
  }
  
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

  const handleNext = () => {
    setMainPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setMainPhotoIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-[#262629] text-gray-500 rounded-xl">
        <span>No photos available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Main Image */}
      <img
        src={photos[mainPhotoIndex]}
        alt="3D asset preview"
        className="w-full h-full object-cover"
      />

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setMainPhotoIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                mainPhotoIndex === index
                  ? "bg-white"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoViewer;
