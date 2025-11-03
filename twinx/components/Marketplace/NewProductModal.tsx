// components/NewProductModal.tsx

import React, { useState } from 'react';
import { ArrowDown, FileText, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { MarketplaceProduct } from '@/twinx/types/TwinxTypes';

// The data needed to create a new product, excluding generated fields
type NewProductData = Omit<MarketplaceProduct, 'id' | 'downloads' | 'createdAt' | 'imageUrl' | 'downloadUrl'>;

interface NewProductModalProps {
  categories: string[];
  onClose: () => void;
  onSubmit: (newProductData: NewProductData) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ categories, onClose, onSubmit }) => {
  const initialFormData: NewProductData = {
    title: '',
    description: '',
    category: categories[0] || '3D Models',
    creator: 'Anonymous',
  };
  const [formData, setFormData] = useState<NewProductData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedFile) {
      setMessage('Please provide a title and select a file.');
      return;
    }
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
      onSubmit(formData);
      setMessage('Product uploaded successfully!');
      setIsSubmitting(false);
      setTimeout(onClose, 1000); // Close after a short delay
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Plus size={24} /> Upload New Asset</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields remain largely the same, but simplified */}
          <div>
            <label htmlFor="title">Title <span className="text-red-400">*</span></label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="category">Category <span className="text-red-400">*</span></label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="creator">Creator Name</label>
            <input name="creator" value={formData.creator} onChange={handleChange} />
          </div>
          <div>
            <label>Asset File <span className="text-red-400">*</span></label>
            <input type="file" onChange={handleFileChange} required />
          </div>
          {message && <div className="text-green-400">{message}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 ...">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Asset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProductModal;