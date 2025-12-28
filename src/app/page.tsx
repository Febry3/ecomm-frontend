"use client";

import { MainBanner } from "@/components/main-banner";
import ProductCard from "@/components/product-card";
import { dummyBannerSlides } from "@/dummy/data-dum-banner";
import { useGetProducts } from "@/services/api/product-service";
import Link from "next/link";
import { useRef, useEffect } from "react";

function getLowestPrice(variants: any[]) {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
}

function getPrimaryImage(images: any[]) {
  if (!images || images.length === 0) return "/placeholder.png";
  const sorted = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  return sorted[0].image_url;
}

export default function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useGetProducts();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten the pages into one array of products
  // data.pages -> [{ products: [...], has_more: true }, { products: [...], ... }]
  const products = data?.pages.flatMap((page) => page.products || []) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  return (
    <div className="flex flex-col min-h-screen">
      <MainBanner slides={dummyBannerSlides} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Newest Arrivals
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our latest products, freshly uploaded by sellers.
            </p>
          </div>

          <div className="w-full bg-secondary rounded-2xl p-6 md:p-10">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[320px] bg-muted rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-10 text-muted-foreground">
                Failed to load products. Please try again later.
              </div>
            ) : products.length > 0 ? (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {products.map((product: any) => (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="group"
                    >
                      <ProductCard
                        id={product.id}
                        title={product.title}
                        description={product.description.replace(/<[^>]*>/g, "")}
                        price={getLowestPrice(product.variants)}
                        rating={0}
                        reviewCount={0}
                        image={getPrimaryImage(product.product_images)}
                        isFavorite={false}
                        badge={product.badge}
                        stock={product.variants?.[0]?.stock?.current_stock}
                      />
                    </Link>
                  ))}
                </div>

                {/* Infinite Scroll Loader / Trigger */}
                {(hasNextPage || isFetchingNextPage) && (
                  <div
                    ref={loadMoreRef}
                    className="flex justify-center py-8"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    </div>
                  </div>
                )}

                {!hasNextPage && products.length > 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    You've reached the end of the list.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No products available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
