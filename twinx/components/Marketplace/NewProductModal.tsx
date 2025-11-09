"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
// Added FileUp and Link icons for the new tab
import { Plus, X, Loader2, Trash2, Upload, FileUp, Link } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { AppUser } from "@/twinx/types/TwinxTypes";
import { getUserById } from "@/twinx/utils/twinxDBUtils.action";

// --- Types (from original file) ---
type DownloadUrlItem = { format: string; url: string };

type NewProductData = {
  title: string;
  description: string;
  category: string;
  creator: string;
  imageUrl: string[]; // Used for primary thumbnail in Tab 1
  downloadUrls: DownloadUrlItem[];
};

interface NewProductModalProps {
  categories: string[];
  onClose: () => void;
  refreshProducts: () => void;
}

// --- Azure Upload Utility (Provided by user and implemented here) ---
// This function handles getting a SAS URL and then PUTting the file directly to Azure Blob Storage.
async function uploadImageToAzure(file: File): Promise<string | null> {
  try {
    // Step 1️⃣ — Ask server for a SAS upload URL
    const sasRes = await fetch("/api/generate-uploadmedia-sas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        filetype: "image", // 👈 tells API to use image container
      }),
    });

    const data = await sasRes.json();
    if (!sasRes.ok || !data?.success) {
      console.error("Failed to get SAS:", data);
      throw new Error(data.message || "Failed to get upload URL");
    }

    const { uploadUrl, blobUrl } = data as { uploadUrl: string; blobUrl: string };

    // Step 2️⃣ — PUT the file directly to Azure
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!putRes.ok) {
      const errText = await putRes.text().catch(() => "");
      console.error("Azure PUT failed:", putRes.status, errText);
      throw new Error("Azure upload failed");
    }

    // ✅ Return public blob URL
    return blobUrl;
  } catch (err) {
    console.error("Azure upload error:", err);
    return null;
  }
}

const NewProductModal: React.FC<NewProductModalProps> = ({
  categories,
  onClose,
  refreshProducts
}) => {

  const initialMigrateData: MigrateProductData = {
    name: "",
    description: "",
    tags: "",
    assetLink: "",
  };

  // --- Shared State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'upload' | 'migrate'>('upload');
  
  // States for file upload section in Tab 1 (new)
  const [selectedPhotosUpload, setSelectedPhotosUpload] = useState<File[]>([]); 
  const [isPhotoUploadingUpload, setIsPhotoUploadingUpload] = useState(false);

  const [migrateData, setMigrateData] = useState(initialMigrateData);
  // State to hold the actual File objects for Tab 2
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]); 
  // State for upload process on the migrate tab
  const [isPhotoUploading, setIsPhotoUploading] = useState(false); 

  const MAX_PHOTOS = 5;

  // Fetch user data ___________________________________
  const { user } = useUser();
  const [fetchedUser, setfetchedUser] = useState<AppUser>();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const fetchedUser = await getUserById(user.id);
        setfetchedUser(fetchedUser)
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      }
    };
    fetchData();
  }, [user]);
  // Fetch user data __________________________________________


  
  // --- TAB 1: UPLOAD FILE (EXISTING LOGIC MODIFIED FOR FILE UPLOAD) ---
  
  // Handler for file selection in Tab 1 (new)
  const handleFileSelectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...selectedPhotosUpload, ...newFiles];
      
      if (combinedFiles.length > MAX_PHOTOS) {
        setMessage(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
        setSelectedPhotosUpload(combinedFiles.slice(0, MAX_PHOTOS));
      } else {
        setSelectedPhotosUpload(combinedFiles);
        setMessage("");
      }
      e.target.value = ''; 
    }
  };

  // Handler for file removal in Tab 1 (new)
  const removePhotoUpload = (fileName: string) => {
    setSelectedPhotosUpload(prev => prev.filter(file => file.name !== fileName));
  };


  // Fix for the reported error: ensure categories[0] access is safe
  const defaultCategory = useMemo(() => categories?.[0] || "3D Models", [categories]);
  
  const initialFormData: NewProductData = {
    title: "",
    description: "",
    category: defaultCategory, // Safely access default category
    creator: "UnAutherised User",
    imageUrl: [], // Will be set after photo upload
    downloadUrls: [{ format: "", url: "" }],
  };

  const [formData, setFormData] = useState<NewProductData>(initialFormData);

  // Existing logic for basic text inputs (unchanged)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Existing logic for Download URLs handling (unchanged)
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

  // Existing Submit handler (MODIFIED to handle file upload first)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for title and selected photos (replaces old imageUrl check)
    if (!formData.title) {
      setMessage("Please fill required fields (title).");
      return;
    }
    if (selectedPhotosUpload.length === 0) {
        setMessage("Please upload at least one image for the asset thumbnail.");
        return;
    }

    setIsSubmitting(true);
    setIsPhotoUploadingUpload(true);
    setMessage(`Uploading ${selectedPhotosUpload.length} image(s) to Azure...`);

    // 1. Upload photos to Azure concurrently
    const uploadPromises = selectedPhotosUpload.map(uploadImageToAzure);
    const uploadedUrls = await Promise.all(uploadPromises);
    const photoUrls = uploadedUrls.filter((url): url is string => url !== null);
    
    setIsPhotoUploadingUpload(false);

    if (photoUrls.length === 0) {
        setMessage("❌ All thumbnail image uploads failed. Please try again.");
        setIsSubmitting(false);
        return;
    }
    
    // 2. Clean up download links
    const cleanedDownloads = formData.downloadUrls
      .map((d) => ({ format: d.format.trim(), url: d.url.trim() }))
      .filter((d) => d.format && d.url);

    // 3. Construct the payload with the uploaded primary image URL
    let payload;
    if(fetchedUser){
      payload = { ...formData, imageUrl: photoUrls, downloadUrls: cleanedDownloads, creator: fetchedUser.name };
    } else {
      setMessage(`Please Login To List New Assets.`);
    }
    

    setMessage(`✅ Image uploaded. Submitting listing data...`);

    try {
      // 4. Submit the final payload
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
  
  // --- TAB 2: MIGRATE EXISTING ASSET (UNCHANGED LOGIC) ---
  
  type MigrateProductData = {
      name: string;
      description: string;
      tags: string;
      assetLink: string;
      // photoUrls will be added to the payload during submission
  }

  const handleMigrateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMigrateData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handler for file selection in Tab 2 (unchanged)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...selectedPhotos, ...newFiles];
      
      if (combinedFiles.length > MAX_PHOTOS) {
        setMessage(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
        setSelectedPhotos(combinedFiles.slice(0, MAX_PHOTOS));
      } else {
        setSelectedPhotos(combinedFiles);
        setMessage("");
      }
      e.target.value = ''; 
    }
  };

  // Handler for file removal in Tab 2 (unchanged)
  const removePhoto = (fileName: string) => {
    setSelectedPhotos(prev => prev.filter(file => file.name !== fileName));
  };












  // Submit handler for Tab 2 (unchanged logic)
  const handleMigrateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!migrateData.name || !migrateData.assetLink) {
        setMessage("Please fill required fields for migration (Name + Asset Link).");
        return;
    }
    
    if (selectedPhotos.length === 0) {
        setMessage("Please upload at least one photo for the asset.");
        return;
    }

    setIsSubmitting(true);
    setIsPhotoUploading(true);
    setMessage(`Uploading ${selectedPhotos.length} photo(s) to Azure...`);
    
    // 1. Upload photos to Azure concurrently
    const uploadPromises = selectedPhotos.map(uploadImageToAzure);
    const uploadedUrls = await Promise.all(uploadPromises);
    
    // 2. Filter out any failed uploads and collect successful URLs
    const photoUrls = uploadedUrls.filter((url): url is string => url !== null);
    
    setIsPhotoUploading(false);
    
    if (photoUrls.length === 0) {
        setMessage("❌ All photo uploads failed. Please try again.");
        setIsSubmitting(false);
        return;
    }

    setMessage(`✅ ${photoUrls.length} photo(s) uploaded. Submitting migration data...`);

    // 3. Construct the final payload including migrate data and photo URLs
    const finalPayload = { 
        ...migrateData,
        photoUrls: photoUrls, // Array of Azure URLs
    };

    console.log("Final Migration Payload to /api/marketplace:", finalPayload);

    // 4. Submit the final payload
    try {
        const res = await fetch("/api/marketplace", { // Using the requested marketplace route
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalPayload),
        });

        const data = await res.json();

        if (res.status === 201) {
            setMessage("✅ Migration Asset Submitted!");
            await refreshProducts(); 
            setTimeout(onClose, 900);
        } else {
            setMessage(`❌ Error submitting migration asset: ${data.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error("Migration submission error:", err);
        setMessage("❌ Server error during migration submission.");
    }

    setIsSubmitting(false);
  };



// need to update the marketplate api route so we can define if the uploading asset is migrated or normal url, and then we can use that api here for migrated asset too
// in the deatield page, use the image urls, for the photo carasol.

// for migrated assets, wrirte a page scrapping script, there can be a button "attempt fectching" this will run scrapping script on the url and attempt to get the image urls,
// downloadurls, text, etc, we maybe can use openAPI for this. and then the section below button will show what all data was able to migrate, and of the mini data we will need like
//title description and download link, the user can proceed or manually enter the image urls or upload images and then submit the form.











  // Reusable Photo Upload Component JSX for Tab 1 and Tab 2
  const PhotoUploadSection = ({ 
    photos, 
    onFileSelect, 
    onRemovePhoto, 
    isUploading, 
    title = "Asset Photos" 
  }: {
    photos: File[],
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemovePhoto: (fileName: string) => void,
    isUploading: boolean,
    title?: string
  }) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-md space-y-3">
      <h3 className="text-sm font-medium text-white/90 flex justify-between items-center">
          {title}
          <span className="text-xs text-indigo-400">({photos.length}/{MAX_PHOTOS})</span>
      </h3>
      
      {/* File Input */}
      <label htmlFor={`photo-upload-${title.replace(/\s/g, '-')}`} className={`block w-full py-2 text-sm text-center rounded-md cursor-pointer transition 
        ${photos.length < MAX_PHOTOS ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30' : 'bg-gray-600/20 text-gray-400 cursor-not-allowed'}`}
      >
          <input
              id={`photo-upload-${title.replace(/\s/g, '-')}`}
              type="file"
              accept="image/*"
              multiple
              onChange={onFileSelect}
              disabled={photos.length >= MAX_PHOTOS || isUploading}
              className="hidden"
          />
          <FileUp size={16} className="inline-block mr-2" />
          {photos.length < MAX_PHOTOS ? "Select Photos (Max 5)" : "Maximum photos selected"}
      </label>

      {/* File Previews/List */}
      {photos.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {photos.map((file, index) => (
            <div key={file.name + index} className="flex items-center justify-between text-xs text-white/70 bg-white/5 p-2 rounded-md">
              <span className="truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemovePhoto(file.name)}
                className="ml-2 p-1 rounded hover:bg-white/10 transition"
                aria-label={`Remove photo ${file.name}`}
                disabled={isUploading}
              >
                <X size={12} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );


  return (
    // CARD (no outer overlay here — parent handles backdrop & blur)
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onClick={(e) => e.stopPropagation()}
      className="p-6 rounded-xl shadow-2xl max-w-4xl w-full mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/6 mb-4" style={{marginBottom:'20px'}}>
        <div className="flex items-center gap-3" style={{marginBottom:'20px'}}>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
            {/* Icon changes based on active tab */}
            {activeTab === 'upload' ? <Plus size={32} className="text-white" /> : <Link size={32} className="text-white" />}
          </div>
          <div>
            <h2 id="upload-title" className="text-lg font-semibold text-white" style={{fontSize:'18px'}}>
              {/* Title changes based on active tab */}
              {activeTab === 'upload' ? 'Upload New Asset' : 'Migrate Existing Asset'}
            </h2>
            <p className="text-sm text-white/60" style={{fontSize:'14px', fontWeight:'lighter'}}>
              {/* Subtitle changes based on active tab */}
              {activeTab === 'upload' ? 'Add a new product to the marketplace' : 'Transfer an existing asset from an external source'}
            </p>
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
    
      {/* --- Tab Navigation (NEW) --- */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('upload'); setMessage(''); }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('migrate'); setMessage(''); }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'migrate'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          Migrate Asset
        </button>
      </div>
      
      {/* --- TAB 1: UPLOAD FILE (EXISTING FORM) --- */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmit}>

          <div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            {/* RIGHT COLUMN */}
            <div className="space-y-4">

              {/* Image Upload Section for Tab 1 */}
              <PhotoUploadSection
                  photos={selectedPhotosUpload}
                  onFileSelect={handleFileSelectUpload}
                  onRemovePhoto={removePhotoUpload}
                  isUploading={isPhotoUploadingUpload}
                  title="Asset Thumbnail Images"
              />

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
          
          {/* Full-width message + actions (Original Block) */}
          <div style={{width:'100%', marginTop:'30px'}}>
            <div className="text-sm text-white/70">{message && <span>{message}</span>}</div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-md border border-white/8 text-white/90 hover:bg-white/3 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isPhotoUploadingUpload || selectedPhotosUpload.length === 0}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
              >
                {isSubmitting || isPhotoUploadingUpload ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {isPhotoUploadingUpload ? "Uploading Images..." : "Submitting..."}
                  </>
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
      )}

      {/* --- TAB 2: MIGRATE EXISTING ASSET (NEW FORM WITH AZURE UPLOAD) --- */}
      {activeTab === 'migrate' && (
        <form onSubmit={handleMigrateSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LEFT COLUMN: Name, Tags, Asset Link */}
            <div className="space-y-4">
              
              {/* Name (similar to Title) */}
              <div className="relative">
                <input
                  id="migrate-name"
                  name="name"
                  value={migrateData.name}
                  onChange={handleMigrateChange}
                  required
                  className="peer w-full bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                                placeholder:text-transparent text-white outline-none
                                focus:border-indigo-500 transition"
                  placeholder="Asset Name"
                  aria-label="Asset Name"
                  autoComplete="off"
                />
                <label
                  htmlFor="migrate-name"
                  className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none
                                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                peer-focus:top-2 peer-focus:text-sm transition-all"
                >
                  Asset Name *
                </label>
              </div>

              {/* Tags */}
              <div className="relative">
                <input
                  id="migrate-tags"
                  name="tags"
                  value={migrateData.tags}
                  onChange={handleMigrateChange}
                  className="w-full bg-transparent border border-white/6 rounded-md px-3 py-4
                                text-white outline-none focus:border-indigo-500 transition"
                  placeholder="Tags (comma separated)"
                  aria-label="Tags"
                />
                <label htmlFor="migrate-tags" className="absolute left-3 -top-3 text-xs text-white/50">
                  Tags (e.g. 3D, Blender, Sci-Fi)
                </label>
              </div>

              {/* Asset Link */}
              <div className="relative">
                <input
                  id="migrate-asset-link"
                  name="assetLink"
                  value={migrateData.assetLink}
                  onChange={handleMigrateChange}
                  required
                  className="peer w-full bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                                placeholder:text-transparent text-white outline-none
                                focus:border-indigo-500 transition"
                  placeholder="Original Asset Link"
                  aria-label="Original Asset Link"
                />
                <label
                  htmlFor="migrate-asset-link"
                  className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none
                                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                peer-focus:top-2 peer-focus:text-sm transition-all"
                >
                  Original Asset Link *
                </label>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Description, Photo Upload */}
            <div className="space-y-4">
              
              {/* Description (Textarea) */}
              <div className="relative">
                <textarea
                  id="migrate-description"
                  name="description"
                  value={migrateData.description}
                  onChange={handleMigrateChange}
                  rows={4} 
                  className="w-full resize-none bg-transparent border border-white/6 rounded-md px-3 pt-6 pb-2
                                  placeholder:text-transparent text-white outline-none
                                  focus:border-indigo-500 transition"
                  placeholder="Description"
                  aria-label="Description"
                />
                <label
                  htmlFor="migrate-description"
                  className="absolute left-3 top-2 text-sm text-white/60 pointer-events-none transition-all"
                >
                  Detailed Description
                </label>
              </div>
              
              {/* Photo Upload Section for Tab 2 */}
              <PhotoUploadSection
                  photos={selectedPhotos}
                  onFileSelect={handleFileSelect}
                  onRemovePhoto={removePhoto}
                  isUploading={isPhotoUploading}
              />
            </div>
          </div>
          
          {/* Full-width message + actions (Migrate Block) */}
          <div style={{width:'100%', marginTop:'30px'}}>
            <div className="text-sm text-white/70">{message && <span>{message}</span>}</div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-md border border-white/8 text-white/90 hover:bg-white/3 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isPhotoUploading || selectedPhotos.length === 0}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white transition disabled:opacity-50"
              >
                {isSubmitting || isPhotoUploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {isPhotoUploading ? "Uploading Photos..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Link size={16} />
                    Migrate Asset
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
};

export default NewProductModal;