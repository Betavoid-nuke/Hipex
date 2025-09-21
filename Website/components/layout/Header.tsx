import { PageName } from '@/app/(root)/page';

interface HeaderProps {
    activePage: PageName;
    onNavClick: (page: PageName) => void;
    onWaitlistClick: () => void;
}

const navLinks: { name: string, page: PageName }[] = [
    { name: 'Home', page: 'home' },
    { name: 'Marketplace', page: 'marketplace' },
    { name: 'One Pager', page: 'one-pager' },
    { name: 'Hipex Apps', page: 'hipex-apps' },
    { name: 'Subscriptions', page: 'subscriptions' },
    { name: 'Get in Touch', page: 'contact' },
];

const Header = ({ activePage, onNavClick, onWaitlistClick }: HeaderProps) => {
    return (
        <header className="header">
            <nav className="navbar-container">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('home'); }} className="logo">HIPEX</a>
                <div className="nav-menu">
                    {navLinks.map((link) => (
                        <a
                            key={link.page}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavClick(link.page);
                            }}
                            className={`nav-link ${activePage === link.page ? 'active' : ''}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
                <div style={{display: 'flex'}} className="space-x-4">
                    <button onClick={onWaitlistClick} className="waitlist-button">Join Waitlist</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;