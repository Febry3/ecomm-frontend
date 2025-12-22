"use client"

import ProductCarousel from "@/components/products-carousel";
import { Button } from "@/components/ui/button";
import { useGetProduct } from "@/services/api/product-service";
import { Minus, Plus, Star, Store } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function ProductPage() {
    const router = useRouter();
    const productId = useParams().productId as string;
    const { data: product, isLoading, isError } = useGetProduct(productId);

    const [quantity, setQuantity] = useState(1);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");

    // Handle variant data
    const variants = product?.variants || [];
    const hasVariants = variants.length > 0;

    // Determine currently selected variant object
    const selectedVariant = hasVariants && selectedVariantId
        ? variants.find((v: any) => v.id === selectedVariantId)
        : hasVariants ? variants[0] : null;

    // Use selected variant data or fallback to product data if no variants/single item product (future proofing)
    // For now API implies products always have variants or we treat main product as base
    // If no specific variant selected (and logic forces one), use first one. 
    // Initial state matching:
    if (hasVariants && !selectedVariantId && variants[0]?.id) {
        setSelectedVariantId(variants[0].id);
    }

    const currentStock = selectedVariant?.stock?.current_stock ?? 0;
    const currentPrice = selectedVariant?.price ?? 0;

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID").format(price);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Skeleton for carousel */}
                    <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                    {/* Skeleton for details */}
                    <div className="flex flex-col gap-6">
                        <div className="h-10 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                        <div className="h-6 bg-gray-100 rounded-lg w-1/4 animate-pulse" />
                        <div className="h-12 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
                        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Product Not Found</h2>
                <Button onClick={() => router.push("/")} variant="outline">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="grid lg:grid-cols-12 gap-6 xl:gap-10">
                {/* Left Column: Images */}
                <div className="lg:col-span-6">
                    <ProductCarousel images={product.product_images || []} />
                </div>

                {/* Right Column: Product Info & Actions */}
                <div className="lg:col-span-6 flex flex-col gap-6 md:sticky md:top-24 h-fit">

                    {/* Header: Badge, Title, Rating */}
                    <div className="flex flex-col gap-3">
                        {product.badge && (
                            <span className="w-fit px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                                {product.badge}
                            </span>
                        )}
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex text-yellow-500">
                                <Star className="fill-current w-4 h-4" />
                            </div>
                            <span>No reviews yet</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                            Rp {formatPrice(currentPrice)}
                        </span>
                    </div>

                    {hasVariants && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground">Select Variant</label>
                            <div className="flex flex-wrap gap-3">
                                {variants.map((v: any) => {
                                    const isSelected = selectedVariantId === v.id;
                                    const isOutOfStock = v.stock?.current_stock === 0;

                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => {
                                                if (!isOutOfStock) {
                                                    setSelectedVariantId(v.id);
                                                    setQuantity(1);
                                                }
                                            }}
                                            disabled={isOutOfStock}
                                            className={`
                                                group relative flex items-center gap-3 px-5 py-2 rounded-xl border transition-all
                                                ${isSelected
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-border hover:border-primary/50 text-foreground"
                                                }
                                                ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer"}
                                            `}
                                        >
                                            <div className="relative w-8 h-8 rounded overflow-hidden bg-white shrink-0">
                                                <Image
                                                    src={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                                                    alt={v.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-semibold text-xs">{v.name}</span>
                                                {v.stock?.current_stock > 0 && v.stock?.current_stock <= 5 && (
                                                    <span className="text-[10px] text-orange-500 font-medium">
                                                        {v.stock.current_stock} left
                                                    </span>
                                                )}
                                            </div>

                                            {/* Corner ribbon for selected state (optional visual flair matching 'chip' style) */}
                                            {isSelected && (
                                                <div className="absolute -bottom-px -right-px w-2 h-2 bg-primary rounded-tl-md" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    {/* Quantity & Stock */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">Quantity</label>
                            <span className="text-sm text-muted-foreground">
                                {currentStock > 0 ? `${currentStock} items available` : 'Out of stock'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 p-1 border rounded-xl w-fit bg-secondary/30">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1 || currentStock === 0}
                                className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                disabled={quantity >= currentStock || currentStock === 0}
                                className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 h-12 text-base font-semibold"
                                disabled={currentStock === 0}
                            >
                                Buy Now
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 h-12 text-base font-semibold border-2"
                                disabled={currentStock === 0}
                            >
                                Add to Cart
                            </Button>
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full h-12 text-base font-semibold text-primary bg-primary/10 hover:bg-primary/20"
                            onClick={() => router.push(`/group-buy/${product.id}`)}
                        >
                            Join Group Buy
                        </Button>
                    </div>

                    {/* Seller Card */}
                    {product.seller && (
                        <div className="flex items-center gap-3 p-3 mt-2 rounded-xl bg-secondary/30 border transition-colors hover:border-primary/30">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-background border">
                                {product.seller.logo_url ? (
                                    <Image
                                        src={product.seller.logo_url}
                                        alt={product.seller.store_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Store className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{product.seller.store_name}</h4>
                                <p className="text-xs text-muted-foreground">Top Rated Seller</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary font-medium hover:text-primary/90">
                                Visit Store
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Details */}
            <div className="mt-10 lg:mt-16 max-w-4xl">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6">Description</h2>
                        <div
                            className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground max-w-none text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}