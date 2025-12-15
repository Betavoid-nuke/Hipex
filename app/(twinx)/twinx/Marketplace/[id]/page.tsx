"use client";

import ProductDetailView from "@/twinx/components/Marketplace/ProductDetailView";
import { MarketplaceProductProduction } from "@/twinx/types/TwinxTypes";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function DetailedPage() {
  const [products, setProducts] = useState<MarketplaceProductProduction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const productID = typeof params?.id === "string" ? params.id : null;

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/marketplace", { cache: "no-store" });
        const data = await res.json();

        if (res.ok) {
          setProducts(data.data || []);
        } else {
          console.error("❌ Failed to fetch products:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Find correct product
  const CurrectProject = useMemo(() => {
    if (!productID) return null;
    return products.find((p) => p._id === productID) || null;
  }, [products, productID]);

  // 🟡 1. Still loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400">Loading Product...</p>
      </div>
    );
  }

  // 🔴 2. Loaded but product not found
  if (!CurrectProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-400">Product not found.</p>
      </div>
    );
  }

  // 🟢 3. Success
  return (
    <ProductDetailView
      product={CurrectProject}
      allProducts={products}
    />
  );
}

export default DetailedPage;
