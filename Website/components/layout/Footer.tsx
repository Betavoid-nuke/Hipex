const Footer = () => {
    return (
        <footer className="bg-gray-950 py-12" style={{borderTop: '1px solid var(--color-border)', zIndex:'99'}}>
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Hipex. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;