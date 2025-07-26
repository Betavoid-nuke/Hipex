// /twinx/modals/DeleteConfirmationModal.tsx
'use client';

import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    text: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, text }: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-md border border-[#3A3A3C] transform transition-all scale-95 animate-scale-in">
                <div className="p-6 text-center">
                    <Trash2 className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-sm text-[#A0A0A5]">{text}</p>
                </div>
                <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-center gap-4">
                    <button onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4A4A4C] transition-colors w-28">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors w-28">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;