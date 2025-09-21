import React from 'react';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const WaitlistModal = ({ isOpen, onClose, onSuccess }: WaitlistModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted');
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="waitlist-modal-content">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    {/* ... Close icon SVG ... */}
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">Join the Hipex Waitlist</h3>
                    <p className="text-lg text-gray-400">Get ahead of the curve with exclusive benefits.</p>
                </div>
                {/* ... Exclusive benefits section ... */}
                <form id="waitlist-form" className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="fullName" placeholder="Full Name" required className="modal-form-input" />
                    <input type="email" name="email" placeholder="Email Address" required className="modal-form-input" />
                    {/* ... Checkbox and Submit Button ... */}
                    <button type="submit" className="primary-button w-full">
                        Join Waitlist Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WaitlistModal;