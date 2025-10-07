import { FC, useEffect, useRef, useState } from "react";
import { NewProjectModalProps } from "../types/TwinxTypes";
import { generateTwinxId } from "../utils/TwinxUtils";
import { UploadCloud, X } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { appId, db } from "../utils/firebaseUtils";
import { showNotification, useNotification } from "./AppNotification";

const NewProjectModal: FC<NewProjectModalProps> = ({ isOpen, onClose, userId }) => {
    const [title, setTitle] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [twinxid, setTwinxid] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTwinxid(generateTwinxId());
        } else {
            setTitle(''); setVideoFile(null); setThumbnail(''); setTwinxid(''); setVideoUrl('');
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setVideoUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
            generateThumbnail(file);
        } else {
            showNotification("Please select a valid video file.");
        }
    };

    const generateThumbnail = (file: File) => {
        setIsGenerating(true);
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.onloadedmetadata = () => { video.currentTime = video.duration / 2; };
        video.onseeked = () => {
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
            }
            setIsGenerating(false);
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            setIsGenerating(false); setThumbnail('');
            showNotification("Could not generate thumbnail from this video.");
            URL.revokeObjectURL(video.src);
        };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !videoFile || !userId) {
            showNotification("Please provide a title and a video file."); return;
        }
        
        onClose();

        const newProject = {
            title, twinxid, thumbnail, videoUrl, isFavorite: false, isPublished: false, currentStep: 0,
            createdAt: new Date(), updatedAt: new Date(),
        };
        try {
            const projectsCollectionPath = `/artifacts/${appId}/users/${userId}/projects`;
            await addDoc(collection(db, projectsCollectionPath), newProject);
            showNotification("Digital Twin created successfully!");
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