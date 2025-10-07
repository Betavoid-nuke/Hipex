import { showNotification } from "../components/AppNotification";

// --- Helper Functions ---
export const generateTwinxId = (): string => {
    const randomPart = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `twinx_${randomPart}`;
};

export const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy.');
    });
};