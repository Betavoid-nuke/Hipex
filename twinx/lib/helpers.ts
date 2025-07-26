// /twinx/lib/helpers.ts

/**
 * Generates a unique ID for a Digital Twin.
 * @returns {string} A string in the format 'twinx_xxxxxxxxxxxxxxxx'.
 */
export const generateTwinxId = (): string => {
    const randomPart = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `twinx_${randomPart}`;
};