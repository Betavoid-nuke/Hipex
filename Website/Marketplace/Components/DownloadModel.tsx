import React, { useEffect } from "react";


// Types
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

interface DownloadModalProps {
  twin: BaseItem;
  onClose: () => void;
}

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


const DownloadModal: React.FC<DownloadModalProps> = ({ twin, onClose }) => {
  const formats = twin.downloadFormats ?? [];

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Download ${twin.title}`}
      onClick={onClose} // clicking backdrop closes
    >
      <div
        className="bg-[#1C1C1E] text-white rounded-xl max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold">Download &ldquo;{twin.title}&rdquo;</h3>
          <button
            onClick={onClose}
            aria-label="Close download modal"
            className="text-gray-400 hover:text-white p-2 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Choose from the available file formats to download your digital twin.
        </p>

        {formats.length === 0 ? (
          <div className="text-center py-8 text-[#A0A0A5]">No downloadable formats available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-400 border-b border-[#3A3A3C]">
                  <th className="py-2">Format</th>
                  <th className="py-2 text-right">File Size</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {formats.map((item, i) => (
                  <tr key={i} className="border-b border-[#2b2b2d]">
                    <td className="py-3 align-middle">{item.format}</td>
                    <td className="py-3 text-right text-gray-400 align-middle">{item.size}</td>
                    <td className="py-3 text-right align-middle">
                      <a
                        href={item.downloadUrl}
                        download
                        onClick={onClose}
                        className="inline-block bg-[#6366F1] hover:bg-[#4f46e5] text-white font-semibold px-4 py-2 rounded-full transition"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
