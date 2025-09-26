'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Product } from '../types';

interface MarketplaceCartProps {
  cartItems: Product[];
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}


let externalOpenCart: ((disable: boolean) => void) | null = null;
export function exthandleOpenCart(disable: boolean) {
  if (externalOpenCart) {
    externalOpenCart(disable);
  } else {
    console.warn("exthandleAddToCart called before BuyAndCart mounted");
  }
}


const MarketplaceCart: React.FC<MarketplaceCartProps> = ({
  cartItems,
  onRemoveItem,
  onCheckout,
}) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const [OpenCart, setOpenCart] = useState<boolean>(false);


  const handleOpenCart = useCallback((disable: boolean) => {
    setOpenCart(disable);
  }, []);
  // Expose externalhandleAddToCart for outside use
  useEffect(() => {
    externalOpenCart = handleOpenCart;
    return () => {
      externalOpenCart = null;
    };
  }, [handleOpenCart]);


  return (
    <>
      <div className={`cart-sidebar ${OpenCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Cart</h2>
          <button onClick={() => {setOpenCart(false)}} className="cart-close-btn">&times;</button>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#A0A0A5', padding: '2rem' }}>
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
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
      {OpenCart && (
        <div 
          onClick={() => {setOpenCart(false)}} 
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 80 }}
        ></div>
      )}
    </>
  );
};

export default MarketplaceCart;