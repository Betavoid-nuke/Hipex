'use client';

import React from 'react';
import { Product } from '../types';

interface MarketplaceCartProps {
  isOpen: boolean;
  cartItems: Product[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const MarketplaceCart: React.FC<MarketplaceCartProps> = ({
  isOpen,
  cartItems,
  onClose,
  onRemoveItem,
  onCheckout,
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Cart</h2>
          <button onClick={onClose} className="cart-close-btn">&times;</button>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#A0A0A5', padding: '2rem' }}>
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.thumbnail} alt={item.title} className="cart-item-thumbnail" />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontWeight: '500' }}>{item.title}</p>
                  <p style={{ fontSize: '0.875rem', color: '#A0A0A5' }}>{item.category}</p>
                </div>
                <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>${item.price.toFixed(2)}</span>
                <button onClick={() => onRemoveItem(item.id)} className="remove-item-btn">&times;</button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.125rem' }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="marketplace-buy-btn" style={{ width: '100%' }}>
              Checkout
            </button>
          </div>
        )}
      </div>
      {/* Optional: Add an overlay to close the cart when clicking outside */}
      {isOpen && (
        <div 
          onClick={onClose} 
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 80 }}
        ></div>
      )}
    </>
  );
};

export default MarketplaceCart;