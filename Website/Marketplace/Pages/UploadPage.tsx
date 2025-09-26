import React, { useState, ChangeEvent, FormEvent } from "react";
import { Asset, DownloadFormat, TechnicalInfo } from "../types";

interface UploadPageProps {
  onBack: () => void;
  onUpload: (asset: Asset) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onBack, onUpload }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [technicalInfo, setTechnicalInfo] = useState<TechnicalInfo[]>([
    { label: "", value: "" },
  ]);
  const [downloadFormats, setDownloadFormats] = useState<DownloadFormat[]>([
    { format: "", size: "", downloadUrl: "" },
  ]);
  const [modelFile, setModelFile] = useState<File | null>(null);

  const handleAddPhoto = () => setPhotos((prev) => [...prev, ""]);

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
  };

  const handleAddTechInfo = () =>
    setTechnicalInfo((prev) => [...prev, { label: "", value: "" }]);

  const handleTechInfoChange = (
    index: number,
    field: keyof TechnicalInfo,
    value: string
  ) => {
    const newInfo = [...technicalInfo];
    newInfo[index][field] = value;
    setTechnicalInfo(newInfo);
  };

  const handleAddDownloadFormat = () =>
    setDownloadFormats((prev) => [
      ...prev,
      { format: "", size: "", downloadUrl: "" },
    ]);

  const handleDownloadFormatChange = (
    index: number,
    field: keyof DownloadFormat,
    value: string
  ) => {
    const newFormats = [...downloadFormats];
    newFormats[index][field] = value;
    setDownloadFormats(newFormats);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setModelFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: Date.now().toString(),
      title,
      description,
      photos,
      technicalInfo,
      downloadFormats,
      modelFile,
    };
    onUpload(newAsset);
    onBack();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white" style={{backgroundColor:'transparent', display:'flex', justifyContent:'center', width:'100%', paddingTop:'20px'}}>
      <div className="max-w-7xl mx-auto" style={{padding:'0px'}}>

        {/* Back to listing button */}
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-[#A0A0A5] hover:text-white mb-6"
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

        {/* heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          Upload New Digital Twin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              rows={4}
            ></textarea>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Photos (URLs)
            </label>
            <div className="space-y-2">
              {photos.map((photo, index) => (
                <input
                  key={index}
                  type="url"
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  placeholder="Image URL"
                  className="w-full bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="mt-2 text-indigo-400 hover:underline"
            >
              Add another photo URL
            </button>
          </div>

          {/* Model File */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              3D Model File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-white"
            />
            {modelFile && (
              <p className="text-gray-400 mt-2">
                File selected: {modelFile.name}
              </p>
            )}
          </div>

          {/* Technical Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
            <div className="space-y-4">
              {technicalInfo.map((info, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={info.label}
                    onChange={(e) =>
                      handleTechInfoChange(index, "label", e.target.value)
                    }
                    placeholder="Label (e.g., Polygons)"
                    className="w-1/2 bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                  <input
                    type="text"
                    value={info.value}
                    onChange={(e) =>
                      handleTechInfoChange(index, "value", e.target.value)
                    }
                    placeholder="Value (e.g., 50,000)"
                    className="w-1/2 bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTechInfo}
              className="mt-2 text-indigo-400 hover:underline"
            >
              Add another detail
            </button>
          </div>

          {/* Download Formats */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Download Formats</h3>
            <div className="space-y-4">
              {downloadFormats.map((format, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={format.format}
                    onChange={(e) =>
                      handleDownloadFormatChange(
                        index,
                        "format",
                        e.target.value
                      )
                    }
                    placeholder="Format (e.g., FBX)"
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                  <input
                    type="text"
                    value={format.size}
                    onChange={(e) =>
                      handleDownloadFormatChange(index, "size", e.target.value)
                    }
                    placeholder="Size (e.g., 125 MB)"
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                  <input
                    type="url"
                    value={format.downloadUrl}
                    onChange={(e) =>
                      handleDownloadFormatChange(
                        index,
                        "downloadUrl",
                        e.target.value
                      )
                    }
                    placeholder="Download URL"
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddDownloadFormat}
              className="mt-2 text-indigo-400 hover:underline"
            >
              Add another format
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#6366F1] hover:bg-[#4f46e5] text-white font-semibold transition-colors duration-300"
          >
            Upload Asset
          </button>
        </form>

      </div>
    </div>
  );
};

export default UploadPage;
