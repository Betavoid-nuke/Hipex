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

/**
 * Generate a thumbnail image File from a video File.
 * Captures a frame from the middle of the video.
 *
 * @param file - The video file to generate a thumbnail from.
 * @returns Promise<File> - The generated thumbnail image as a File.
 */
export const generateThumbnailFile = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = () => {
      // Jump to middle frame
      video.currentTime = video.duration / 2;
    };

    video.onseeked = () => {
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
              resolve(thumbnailFile);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
            URL.revokeObjectURL(video.src);
          },
          'image/jpeg',
          0.8
        );
      } catch (err) {
        reject(err);
        URL.revokeObjectURL(video.src);
      }
    };

    video.onerror = (e) => {
      reject(new Error('Error loading video for thumbnail generation'));
      URL.revokeObjectURL(video.src);
    };
  });
};
