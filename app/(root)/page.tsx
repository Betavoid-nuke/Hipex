"use client";

import Footer from '@/Website/components/layout/Footer';
import Header from '@/Website/components/layout/Header';
import ContactModal from '@/Website/components/modals/ContactModal';
import SuccessModal from '@/Website/components/modals/SuccessModal';
import WaitlistModal from '@/Website/components/modals/WaitlistModal';
import ContactPage from '@/Website/components/pages/ContactPage';
import HipexAppsPage from '@/Website/components/pages/HipexAppsPage';
import HomePage from '@/Website/components/pages/HomePage';
import MarketplacePage from '@/Website/components/pages/MarketplacePage';
import OnePagerPage from '@/Website/components/pages/OnePagerPage';
import SubscriptionsPage from '@/Website/components/pages/SubscriptionsPage';
import { useEffect, useState } from 'react';

export type PageName = 'home' | 'marketplace' | 'one-pager' | 'hipex-apps' | 'subscriptions' | 'contact';

export default function App() {
  const [activePage, setActivePage] = useState<PageName>('home');
  const [isWaitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const showPage = (pageId: PageName) => {
    setActivePage(pageId);
    window.scrollTo(0, 0);
  };

  const showSuccessMessage = () => {
    setSuccessVisible(true);
    setTimeout(() => setSuccessVisible(false), 3000);
  };

  return (
    <>
      <Header
        activePage={activePage}
        onNavClick={showPage}
        onWaitlistClick={() => setWaitlistModalOpen(true)}
      />
      <main style={{background:'rgb(9 10 20)'}}>
        {/* We add 'page' class to all, and 'active' to the one that should be visible */}
        <div className={`page ${activePage === 'home' ? 'active' : ''}`}><HomePage onWaitlistClick={() => setWaitlistModalOpen(true)} onContactClick={() => setContactModalOpen(true)} /></div>
        <div className={`page ${activePage === 'marketplace' ? 'active' : ''}`}><MarketplacePage /></div>
        <div className={`page ${activePage === 'one-pager' ? 'active' : ''}`} style={{padding:'0px'}}><OnePagerPage onContactClick={() => setContactModalOpen(true)} /></div>
        <div className={`page ${activePage === 'hipex-apps' ? 'active' : ''}`}><HipexAppsPage /></div>
        <div className={`page ${activePage === 'subscriptions' ? 'active' : ''}`}><SubscriptionsPage onContactClick={() => setContactModalOpen(true)} /></div>
        <div className={`page ${activePage === 'contact' ? 'active' : ''}`}><ContactPage /></div>
      </main>
      <Footer />
      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} onSuccess={showSuccessMessage} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
      <SuccessModal isVisible={isSuccessVisible} message="Thank you for joining the waitlist!" />
    </>
  );
}