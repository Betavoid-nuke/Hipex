
"use client";

import ProductDetailView from "@/twinx/components/Marketplace/ProductDetailView";
import { MarketplaceProductProduction } from "@/twinx/types/TwinxTypes";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function detailedPage() {
    const [products, setProducts] = useState<MarketplaceProductProduction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Fetch ID for product
    const [productID, setproductID] = useState<string | null>(null);
    const params = useParams();
    const id = params?.id as string | null;
    useEffect(() => {
      if (id) {
        setproductID(id);
      }
    }, [id]);

    // Fetch all listed assets
    async function fetchProducts() {
      try {
        const res = await fetch("/api/marketplace", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setProducts(data.data); // API returns: { message, data: [...] }
        } else {
          console.error("❌ Failed to fetch products:", data);
          setProducts([]); // fallback empty
        }
      } catch (err) {
        console.error("❌ Network error while fetching products:", err);
        setProducts([]); // fallback
      } finally {
        setIsLoading(false);
      }
    }
    useEffect(() => {
      fetchProducts();
    }, []);
    
    //finds the correct project to display
    const CurrectProject = useMemo(() => {
      if (!products || !productID) return null; // safety check

      // Find the product whose id matches the given productID
      const product = products.find((p) => p._id === productID);

      return product || null;
    }, [products, productID]);

    if (!CurrectProject) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-400">Loading Product.</p>
        </div>
        );
    }

    return (
        <ProductDetailView
          product={CurrectProject}
          allProducts={products}
        />
    )
}

export default detailedPage;






















//make the button for going back, make loading page, make a edit button if the creatorid is same as the fetcheduser.id this edit button will redirect to marketplace/edit/[id] page