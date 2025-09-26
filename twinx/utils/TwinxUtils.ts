
// --- Helper Functions ---
export const generateTwinxId = (): string => {
    const randomPart = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `twinx_${randomPart}`;
};