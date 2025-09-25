// components/CheckoutModal.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { Product } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: Product[];
  onClose: () => void;
  onPaymentSubmit: () => void;
}

type PaymentMethod = 'card' | 'apple-pay' | 'google-pay';

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onPaymentSubmit,
}) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('card');

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = (event: FormEvent) => {
    event.preventDefault();
    console.log('Payment form submitted! (Simulated)');
    onPaymentSubmit();
  };
  
  const renderPaymentForm = () => {
    switch(activeMethod) {
      case 'card':
        return (
          <form id="payment-form" onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="card-number" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#A0A0A5' }}>Card Number</label>
              <input type="text" id="card-number" className="stripe-input" placeholder="•••• •••• •••• ••••" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label htmlFor="expiry-date" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#A0A0A5' }}>Expires</label>
                <input type="text" id="expiry-date" className="stripe-input" placeholder="MM / YY" required />
              </div>
              <div>
                <label htmlFor="cvc" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#A0A0A5' }}>CVC</label>
                <input type="text" id="cvc" className="stripe-input" placeholder="•••" required />
              </div>
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#A0A0A5' }}>Email</label>
              <input type="email" id="email" className="stripe-input" placeholder="your-email@example.com" required />
            </div>
            <button type="submit" className="pay-btn">Pay ${total.toFixed(2)}</button>
          </form>
        );
      case 'apple-pay':
        return (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #3A3A3C', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#D1D5DB' }}>Apple Pay is ready to be implemented here.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#6B7280' }}>This is a placeholder for demonstration purposes.</p>
          </div>
        );
      case 'google-pay':
        return (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #3A3A3C', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#D1D5DB' }}>Google Pay is ready to be implemented here.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#6B7280' }}>This is a placeholder for demonstration purposes.</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Checkout</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #3A3A3C' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img src={item.thumbnail} alt={item.title} style={{ width: '4rem', height: '4rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>{item.title}</p>
                <p style={{ fontSize: '0.875rem', color: '#A0A0A5' }}>{item.description}</p>
              </div>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setActiveMethod('card')} className={`payment-method-btn ${activeMethod === 'card' ? 'active' : ''}`}>
             Card
          </button>
          <button onClick={() => setActiveMethod('apple-pay')} className={`payment-method-btn ${activeMethod === 'apple-pay' ? 'active' : ''}`}>
             Apple Pay
          </button>
          <button onClick={() => setActiveMethod('google-pay')} className={`payment-method-btn ${activeMethod === 'google-pay' ? 'active' : ''}`}>
             Google Pay
          </button>
        </div>

        {renderPaymentForm()}

        <div className="stripe-footer">
          Powered by <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe Logo" style={{ display: 'inline-block', height: '1rem', marginLeft: '0.25rem', filter: 'brightness(0) invert(1)' }} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;