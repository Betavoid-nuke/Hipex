// components/DownloadModal.tsx

import React, { useState, useMemo } from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { MarketplaceProduct } from '@/twinx/types/TwinxTypes';

interface DownloadModalProps {
  product: MarketplaceProduct;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ product, onClose }) => {
  const formats = useMemo(() => {
    switch (product.category) {
      case '3D Models': return ['OBJ', 'FBX', 'GLB', 'USDZ'];
      case 'Textures': return ['PNG (4K)', 'JPG (2K)', 'EXR'];
      case 'Audio': return ['WAV', 'MP3', 'OGG'];
      case 'Brushes': return ['ABR (PS)', 'BRD (Procreate)'];
      default: return ['ZIP'];
    }
  }, [product.category]);

  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadMessage('');

    setTimeout(() => {
      setDownloadMessage(`Success! Preparing download for ${product.title} (${selectedFormat}).`);
      if (product.downloadUrl) {
          window.open(product.downloadUrl, '_blank');
      }
      setDownloading(false);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Download size={20} className="text-green-400" /> Select Format</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-400 mb-4">Choose the format for **{product.title}**:</p>
        <div className="space-y-3 mb-6">
          {formats.map(format => (
            <label
              key={format}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedFormat === format ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 hover:border-gray-600 bg-gray-700/50'}`}
            >
              <input
                type="radio"
                name="format"
                value={format}
                checked={selectedFormat === format}
                onChange={() => setSelectedFormat(format)}
                className="form-radio text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="ml-3 text-white font-medium">{format}</span>
            </label>
          ))}
        </div>
        {downloadMessage && (
          <div className="p-3 mb-4 rounded-lg bg-green-900/50 text-green-400 text-sm font-medium">
            {downloadMessage}
          </div>
        )}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:bg-green-800"
        >
          {downloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          {downloading ? `Preparing...` : `Download (${selectedFormat})`}
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;