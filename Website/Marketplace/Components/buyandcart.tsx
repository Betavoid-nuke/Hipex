import { useCallback, useEffect, useState } from "react";
import { Product } from "../types";
import MarketplaceCart from "./BuyCart";
import CheckoutModal from "./CheckoutModal";
import { updateCartButtonBadge } from "./cartbutton";
import { exthandleDisableAddBtn } from "./BuyCard";

//sends the cart information to the cart button for the notification badge on the button
function updateCartButton(cart: Product[]) {
  updateCartButtonBadge(cart);
}

let externalhandleAddToCart: ((productToAdd: Product) => void) | null = null;
export function exthandleAddToCart(productToAdd: Product) {
  if (externalhandleAddToCart) {
    externalhandleAddToCart(productToAdd);
  } else {
    console.warn("exthandleAddToCart called before BuyAndCart mounted");
  }
}

// We'll store the setter in a module-level variable
let externalhandleRemoveFromCart: ((productId: string) => void) | null = null;
// Exported function that other files can call
export function exthandleRemoveFromCart(productId: string) {
  if (externalhandleRemoveFromCart) {
    externalhandleRemoveFromCart(productId);
  } else {
    console.warn("iscartopenUpdate called before BuyAndCart mounted");
  }
}

// We'll store the setter in a module-level variable
let externalhandleBuyNow: (() => void) | null = null;
// Exported function that other files can call
export function exthandleBuyNow() {
  if (externalhandleBuyNow) {
    externalhandleBuyNow();
  } else {
    console.warn("iscartopenUpdate called before BuyAndCart mounted");
  }
}

// We'll store the setter in a module-level variable
let externalhandlehandleCheckout: (() => void) | null = null;
// Exported function that other files can call
export function exthandlehandleCheckout() {
  if (externalhandlehandleCheckout) {
    externalhandlehandleCheckout();
  } else {
    console.warn("iscartopenUpdate called before BuyAndCart mounted");
  }
}

// We'll store the setter in a module-level variable
let externalhandlePaymentSuccess: (() => void) | null = null;
// Exported function that other files can call
export function exthandlehandlePaymentSuccess() {
  if (externalhandlePaymentSuccess) {
    externalhandlePaymentSuccess();
  } else {
    console.warn("iscartopenUpdate called before BuyAndCart mounted");
  }
}

export function extIsProductInCart(incart: boolean) {
  exthandleDisableAddBtn(incart);
}

export default function BuyAndCart() {
  
  // BUY AND CART FUNCTIONALITIES -----------------------------------------------
  const [cart, setCart] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // This is your product data. In a real app, this would likely come from an API.
  const product: Product = {
    id: 'prod_12345',
    title: 'Awesome Product',
    description: 'A digital download for an awesome product.',
    author: 'AI Creator',
    price: 29.99,
    image: 'https://placehold.co/600x400/17151f/A0A0A5?text=Awesome+Product',
    category: 'Digital'
  };

  //when cart updates, send the number of products to the cart button for the notification badge on the button
  useEffect(() => {
    updateCartButton(cart);
  }, [cart]);
 
  const handleAddToCart = useCallback((productToAdd: Product) => {
    extIsProductInCart(true)
    setCart(prevCart => {
      // check against prevCart (the latest)
      if (prevCart.some(item => item.id === productToAdd.id)) {
        console.log("Already in cart:", productToAdd.id, "cart:", prevCart);
        return prevCart; // no change
      }
      const next = [...prevCart, productToAdd];
      console.log("Added to cart:", productToAdd.id, "next cart:", next);
      return next;
    });
  }, []);
  // Expose externalhandleAddToCart for outside use
  useEffect(() => {
    externalhandleAddToCart = handleAddToCart;
    return () => {
      externalhandleAddToCart = null;
    };
  }, [handleAddToCart]);


  // Expose externalhandleRemoveFromCart for outside use
  useEffect(() => {
    externalhandleRemoveFromCart = handleRemoveFromCart;
    return () => {
      externalhandleRemoveFromCart = null; // cleanup when component unmounts
    };
  }, []);
  const handleRemoveFromCart = (productId: string) => {
    console.log("handleRemoveFromCart");
    extIsProductInCart(false)
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Expose externalhandleBuyNow for outside use
  useEffect(() => {
    externalhandleBuyNow = handleBuyNow;
    return () => {
      externalhandleBuyNow = null; // cleanup when component unmounts
    };
  }, []);
  const handleBuyNow = () => {
    // If the item isn't in the cart, add it before opening the modal
    console.log("handleBuyNow");
    if (!cart.find(item => item.id === product.id)) {
      setCart([product]);
    }
    setIsModalOpen(true);
  };

  // Expose externalhandleBuyNow for outside use
  useEffect(() => {
    externalhandlehandleCheckout = handleCheckout;
    return () => {
      externalhandlehandleCheckout = null; // cleanup when component unmounts
    };
  }, []);
  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  // Expose externalhandleBuyNow for outside use
  useEffect(() => {
    externalhandlePaymentSuccess = handlePaymentSuccess;
    return () => {
      externalhandlePaymentSuccess = null; // cleanup when component unmounts
    };
  }, []);
  const handlePaymentSuccess = () => {
    console.log("handlePaymentSuccess");
    setIsModalOpen(false);
    setCart([]); // Clear the cart after successful payment
    alert('Payment successful! (Simulated)');
  };

  return (
    <div>
        <MarketplaceCart
          cartItems={cart}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
        <CheckoutModal 
          isOpen={isModalOpen}
          cartItems={cart}
          onClose={() => setIsModalOpen(false)}
          onPaymentSubmit={handlePaymentSuccess}
        />
    </div>
  )

} 