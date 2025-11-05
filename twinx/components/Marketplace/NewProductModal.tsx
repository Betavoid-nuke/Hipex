"use client";
import React, { useState } from "react";
import { Plus, X, Loader2, Trash2, Upload } from "lucide-react";

type DownloadUrlItem = { format: string; url: string };

type NewProductData = {
  title: string;
  description: string;
  category: string;
  creator: string;
  imageUrl: string;
  downloadUrls: DownloadUrlItem[];
};

interface NewProductModalProps {
  categories: string[];
  onClose: () => void;
  refreshProducts: () => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({
  categories,
  onClose,
  refreshProducts
}) => {
  const initialFormData: NewProductData = {
    title: "",
    description: "",
    category: categories[0] || "3D Models",
    creator: "Anonymous",
    imageUrl: "",
    downloadUrls: [{ format: "", url: "" }],
  };

  const [formData, setFormData] = useState<NewProductData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Basic text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Download URLs handling
  const handleDownloadUrlChange = (
    index: number,
    field: "format" | "url",
    value: string
  ) => {
    const updated = [...formData.downloadUrls];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, downloadUrls: updated }));
  };

  const addDownloadUrl = () => {
    setFormData((prev) => ({
      ...prev,
      downloadUrls: [...prev.downloadUrls, { format: "", url: "" }],
    }));
  };

  const removeDownloadUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      downloadUrls: prev.downloadUrls.filter((_, i) => i !== index),
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      setMessage("Please fill required fields (title + image url).");
      return;
    }

    setIsSubmitting(true);

    // ✅ Clean up empty download links before sending
    const cleanedDownloads = formData.downloadUrls
      .map((d) => ({ format: d.format.trim(), url: d.url.trim() }))
      .filter((d) => d.format && d.url);

    const payload = { ...formData, downloadUrls: cleanedDownloads };

    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 201) {
        setMessage("✅ Listing Created!");
        await refreshProducts();
        setTimeout(onClose, 900);
      } else if (res.status === 200 && data.message === "Product already exists") {
        setMessage("⚠️ Product already exists!");
      } else {
        setMessage("❌ Error listing your asset. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please try again later.");
    }

    setIsSubmitting(false);
  };

  return (
    // CARD (no outer overlay here — parent handles backdrop & blur)
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/6 mb-4" style={{marginBottom:'20px'}}>
        <div className="flex items-center gap-3" style={{marginBottom:'20px'}}>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
            <Plus size={32} className="text-white" />
          </div>
          <div>
            <h2 id="upload-title" className="text-lg font-semibold text-white" style={{fontSize:'18px'}}>
              Upload New Asset
            </h2>
            <p className="text-sm text-white/60" style={{fontSize:'14px', fontWeight:'lighter'}}>Add a new product to the marketplace</p>
          </div>
        </div>
    
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-md hover:bg-white/5 transition"
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>
      </div>
    
      {/* Form */}
      <form onSubmit={handleSubmit}>

        <div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
          {/* Title (floating label) */}
          <div className="relative">
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="peer w-full bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                         placeholder:text-transparent text-white outline-none
                         focus:border-indigo-500 transition"
              placeholder="Title"
              aria-label="Title"
              autoComplete="off"
            />
            <label
              htmlFor="title"
              className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none
                         peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                         peer-focus:top-2 peer-focus:text-sm transition-all"
            >
              Title *
            </label>
          </div>
    
          {/* Category (styled select) */}
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="appearance-none w-full bg-transparent border border-white/6 rounded-md px-3 py-4
                         text-white outline-none focus:border-indigo-500 transition"
              aria-label="Category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-black/60 text-white">
                  {cat}
                </option>
              ))}
            </select>
            <label
              htmlFor="category"
              className="absolute left-3 -top-3 text-xs text-white/50 select-none"
            >
              Category *
            </label>
          </div>
            
          {/* Image URL */}
          <div className="relative">
            <input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="peer w-full bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                         placeholder:text-transparent text-white outline-none
                         focus:border-indigo-500 transition"
              placeholder="Image URL"
              aria-label="Image URL"
            />
            <label
              htmlFor="imageUrl"
              className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none
                         peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                         peer-focus:top-2 peer-focus:text-sm transition-all"
            >
              Image URL *
            </label>
            
            {/* Live image preview (small) */}
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="preview"
                  className="h-20 w-20 object-cover rounded-md border border-white/6"
                  onError={(e) => {
                    // hide broken preview gracefully
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Creator */}
          <div className="relative">
            <input
              id="creator"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/6 rounded-md px-3 py-4
                         text-white outline-none focus:border-indigo-500 transition"
              placeholder="Creator"
              aria-label="Creator"
            />
            <label htmlFor="creator" className="absolute left-3 -top-3 text-xs text-white/50">
              Creator
            </label>
          </div>
          </div>
            
          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* Description (full height in right column) */}
            <div className="relative md:h-full">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="w-full h-full resize-none bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                           placeholder:text-transparent text-white outline-none
                           focus:border-indigo-500 transition"
                placeholder="Description"
                aria-label="Description"
              />
              <label
                htmlFor="description"
                className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none transition-all"
              >
                Description
              </label>
            </div>
            
            {/* Download URLs section */}
            <div className="bg-white/3 border border-white/6 rounded-md p-3" style={{borderColor:'gray'}}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Download URLs</h3>
              <button
                type="button"
                onClick={addDownloadUrl}
                className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/5 transition"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          
            <div className="space-y-2">
              {formData.downloadUrls.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    className="col-span-4 bg-transparent border border-white/6 rounded-md px-2 py-2 text-white outline-none focus:border-indigo-500 transition"
                    placeholder="format (zip)"
                    value={item.format}
                    onChange={(e) => handleDownloadUrlChange(index, "format", e.target.value)}
                    aria-label={`format-${index}`}
                  />
                  <input
                    className="col-span-7 bg-transparent border border-white/6 rounded-md px-2 py-2 text-white outline-none focus:border-indigo-500 transition"
                    placeholder="https://download-link"
                    value={item.url}
                    onChange={(e) => handleDownloadUrlChange(index, "url", e.target.value)}
                    aria-label={`link-${index}`}
                  />
                  <div className="col-span-1 flex justify-end">
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => removeDownloadUrl(index)}
                        className="p-2 rounded-md hover:bg-white/5 transition"
                        aria-label={`Remove download URL ${index}`}
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
        
        {/* Full-width message + actions */}
        <div style={{width:'100%', marginTop:'30px'}}>
          <div className="text-sm text-white/70">{message && <span>{message}</span>}</div>
            
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-md border border-white/8 text-white/90 hover:bg-white/3 transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Upload size={16} />
                  Submit Asset
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );

};

export default NewProductModal;
