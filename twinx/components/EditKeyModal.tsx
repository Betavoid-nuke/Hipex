"use client";

import { FC, useEffect, useState } from "react";
import { EditKeyModalProps } from "../types/TwinxTypes";
import { X } from "lucide-react";

const EditKeyModal: FC<EditKeyModalProps> = ({ isOpen, onClose, onSave, apiKey }) => {
    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (apiKey) {
            setName(apiKey.name);
        }
    }, [apiKey]);

    if (!isOpen || !apiKey) return null;

    const handleSave = () => {
        onSave(apiKey.id, name);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-md border border-[#3A3A3C] transform transition-all scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                    <h3 className="text-xl font-bold text-white">Edit API Key</h3>
                    <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="keyName" className="block text-sm font-medium text-white mb-1">Key Name</label>
                        <input type="text" id="keyName" value={name} onChange={(e) => setName(e.target.value)}
                               className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
                    </div>
                </div>
                <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4A4A4C] transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditKeyModal;