import React from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic
        console.log('Contact form submitted');
        onClose(); // Close modal on submission
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-gray-700">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">Contact Us</h3>
                <p className="text-gray-400 mb-6">Please provide your details and we will get back to you shortly.</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input type="text" placeholder="Your Name" className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors duration-300" />
                    </div>
                    <div>
                        <input type="email" placeholder="Email Address" className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors duration-300" />
                    </div>
                    <div>
                        <select className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 text-white appearance-none transition-colors duration-300">
                            <option value="" disabled selected className="text-gray-500">Select an option...</option>
                            <option value="general" className="text-white">General Inquiry</option>
                            <option value="investor" className="text-white">Investor Relations</option>
                            <option value="support" className="text-white">Support</option>
                        </select>
                    </div>
                    <div>
                        <textarea placeholder="Your Message" rows={6} className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors duration-300"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;