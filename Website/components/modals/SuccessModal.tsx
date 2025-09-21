interface SuccessModalProps {
    isVisible: boolean;
    message: string;
}

const SuccessModal = ({ isVisible, message }: SuccessModalProps) => {
    return (
        <div className={`fixed bottom-8 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-full shadow-lg transition-transform duration-500 ease-in-out transform ${isVisible ? 'scale-100' : 'scale-0'} origin-bottom-right`}>
            <p>{message}</p>
        </div>
    );
};

export default SuccessModal;