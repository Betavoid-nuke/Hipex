import { FC, useEffect, useRef, useState } from "react";
import { NewProjectModalProps } from "../types/TwinxTypes";
import { generateThumbnailFile, generateTwinxId } from "../utils/TwinxUtils";
import { UploadCloud, X } from "lucide-react";
import { showNotification } from "./AppNotification";
import { createProject, getUserById } from "../utils/twinxDBUtils.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import User from "@/lib/models/user.model";

const NewProjectModal: FC<NewProjectModalProps> = ({ isOpen, onClose, userId }) => {

    const [title, setTitle] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [twinxid, setTwinxid] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
    const [UserData, setUserData] = useState<any>(null);
    const { user } = useUser();
  
    //gets the user from mongodb and checks if onboarded or na, and shows the onboaridng cards if not or will send to dashboard
    useEffect(() => {
      if (user) {
  
        const fetchUser = async () => {
          try {
  
            const fetchedUser = await getUserById(user.id);
  
            if(!fetchedUser){
            } else {
              if(fetchedUser.onboarded){
                setLoading(false);
                setUserData(fetchedUser);            //done loading, show the modal
              }
            }
  
          } catch (error) {
            console.error('❌ Error fetching user:', error);
          }
        };
        fetchUser();
  
      }
    }, [user]); 

    useEffect(() => {
        if (isOpen) {
            setTwinxid(generateTwinxId());
        } else {
            setTitle(''); setVideoFile(null); setThumbnail(null); setTwinxid(''); setVideoUrl('');
        }
    }, [isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('video/')) {
        showNotification('Please select a valid video file.');
        return;
      }

      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));

      //upload video to azure
      handleUploadToAzure();

      try {

        setIsGenerating(true);
        const thumbnailFile = await generateThumbnailFile(file);
        console.log('✅ Thumbnail generated:', thumbnailFile);
        
        setThumbnail(thumbnailFile);

        // ⬇️ Here you can directly upload `thumbnailFile` to Azure Blob
        await handleUploadPhotoToAzure();

      } catch (err) {

        console.error('❌ Thumbnail generation failed', err);
        showNotification('Could not generate thumbnail from this video.');

      } finally {

        setIsGenerating(false);

      }
    };

    //upload video
    const handleUploadToAzure = async () => {

      if (!videoFile){
        return
      } else {
      
        setIsGenerating(true);

        try {

        // 1) ask server for SAS url
        const res = await fetch("/api/generate-uploadmedia-sas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: videoFile.name }),
        });
        const data = await res.json();
        if (!data.success) {
          showNotification(data.message || "Failed to get upload URL", "error");
          setIsGenerating(false);
          return;
        }

        const { uploadUrl, blobUrl } = data as { uploadUrl: string; blobUrl: string };

        // 2) PUT the file directly to Azure
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": videoFile.type,
          },
          body: videoFile,
        });

        if (!putRes.ok) {
          const text = await putRes.text().catch(() => "");
          console.error("Azure PUT failed:", putRes.status, text);
          showNotification("Upload failed", "error");
        } else {
          // success — blobUrl is the public URL (container must have blob public access)
          setVideoUrl(blobUrl);
          showNotification("Upload complete", "normal");
          console.log(blobUrl);
          
        }

        } catch (err) {
        console.error(err);
        showNotification("Upload error", "error");
        } finally {
        setIsGenerating(false);
        }
        
      }

    };

    //upload thumbnail jpeg
    const handleUploadPhotoToAzure = async () => {

      if (!thumbnail){
        return
      } else {
      
        setIsGenerating(true);

        try {

        // 1) ask server for SAS url
        const res = await fetch("/api/generate-uploadmedia-sas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: twinxid }),
        });
        const data = await res.json();
        if (!data.success) {
          showNotification(data.message || "Failed to get upload URL", "error");
          setIsGenerating(false);
          return;
        }

        const { uploadUrl, blobUrl } = data as { uploadUrl: string; blobUrl: string };

        // 2) PUT the file directly to Azure
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": "jpeg",
          },
          body: thumbnail,
        });

        if (!putRes.ok) {
          const text = await putRes.text().catch(() => "");
          console.error("Azure PUT failed:", putRes.status, text);
          showNotification("Upload failed", "error");
        } else {
          // success — blobUrl is the public URL (container must have blob public access)
          setVideoUrl(blobUrl);
          showNotification("Upload complete", "normal");

          // OPTIONAL: save blobUrl into your project doc via your backend (createProject/updateProject)
          // await fetch('/api/save-blob-url', { method: 'POST', body: JSON.stringify({ projectId, blobUrl })});
        }

        } catch (err) {
        console.error(err);
        showNotification("Upload error", "error");
        } finally {
        setIsGenerating(false);
        }

      }

    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        if (!title || !videoFile || !userId) {
          showNotification("Please provide a title and a video file."); return;
        }
        
        onClose();

        const newProject = {
            title: title,
            twinxid: twinxid,
            currentStep: 0,
            ownerID: userId,                   //project model has clerk user id
            published: false,
            thumbnail: "",
            // thumbnail: thumbnail,          base64 thumbnail is generated and it is too big to be stored. figure this out later
            videoUrl: videoUrl
        };

        const redirectPath = '/twinx/Dashboard/'+userId;


        try {
            createProject(newProject, UserData?._id.toString(), redirectPath);        //user model will have _id of the project
            showNotification("Video Uploaded successfully!", "normal");
        } catch (error) {
            console.error("Error creating Digital Twin:", error);
            showNotification("Failed to create Digital Twin.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-lg border border-[#3A3A3C] transform transition-all scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                    <h3 className="text-xl font-bold text-white">Create New Digital Twin</h3>
                    <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Digital Twin Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                                   className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Upload Video</label>
                            <div onClick={() => fileInputRef.current?.click()}
                                 className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#3A3A3C] border-dashed rounded-md cursor-pointer hover:border-[#6366F1]">
                                <div className="space-y-1 text-center">
                                    {thumbnail ? <img src={thumbnail} alt="Video preview" className="mx-auto h-24 rounded-md" /> : isGenerating ? <p className="text-[#A0A0A5]">Generating preview...</p> : <UploadCloud className="mx-auto h-12 w-12 text-[#A0A0A5]" />}
                                    <div className="flex text-sm text-[#A0A0A5]"><p className="pl-1">{videoFile ? videoFile.name : 'Click to upload or drag and drop'}</p></div>
                                    <p className="text-xs text-[#A0A0A5]">MP4, MOV, AVI up to 5GB</p>
                                </div>
                            </div>
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} />
                        </div>
                        <div>
                            <label htmlFor="twinxid" className="block text-sm font-medium text-white mb-1">Twinx ID</label>
                            <input type="text" id="twinxid" value={twinxid} readOnly className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-[#A0A0A5] font-mono" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4A4A4C] transition-colors">Cancel</button>
                        <button type="submit" disabled={isGenerating || !thumbnail} className="bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed">
                            {isGenerating ? 'Processing...' : 'Create Digital Twin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProjectModal;