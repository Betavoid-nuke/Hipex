import { BsCart2 } from "react-icons/bs";
import { Product } from "../types";
import { useCallback, useEffect, useState } from "react";
import { exthandleOpenCart } from "./BuyCart";

let cartData: Product[] = [];

// gets update from the BuyAndCart.tsx component when the cart updates
export function updateCartButtonBadge(cart: Product[]) {
    cartData = cart;
}

export default function CartButton() {

    return (
        <div>
            {/* Cart Icon */}
            <button onClick={() => exthandleOpenCart(true)} className="cart-icon" style={{backgroundColor:'#6366f1'}}>
                {/* You can add your cart icon here, e.g., from a library like react-icons */}
                <BsCart2 size={22} />
                {cartData.length > 0 && (
                    <span className="cart-count">{cartData.length}</span>
                )}
            </button>
        </div>
    )
}