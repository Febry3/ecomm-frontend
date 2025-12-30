"use client"

import ProductCarousel from "@/components/products-carousel";
import { Button } from "@/components/ui/button";
import { useGetProduct } from "@/services/api/product-service";
import { Minus, Plus, Star, Store, Users, Truck, Heart } from "lucide-react";
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
    const [isLiked, setIsLiked] = useState(false);

    // Handle variant data
    const variants = product?.variants || [];
    const hasVariants = variants.length > 0;

    // Determine currently selected variant object
    const selectedVariant = hasVariants && selectedVariantId
        ? variants.find((v: any) => v.id === selectedVariantId)
        : hasVariants ? variants[0] : null;

    // Initial state matching
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
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8">
                <div className="grid lg:grid-cols-12 gap-8 xl:gap-14">
                    {/* Image Skeleton */}
                    <div className="lg:col-span-6">
                        <div className="aspect-square bg-muted/60 rounded-3xl animate-pulse" />
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-muted/40 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="lg:col-span-6 flex flex-col gap-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="h-10 md:h-12 bg-muted/60 rounded-xl w-3/4 animate-pulse" />
                            <div className="flex gap-4">
                                <div className="h-5 bg-muted/40 rounded-md w-32 animate-pulse" />
                                <div className="h-5 bg-muted/40 rounded-md w-24 animate-pulse" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="h-10 bg-muted/60 rounded-xl w-48 animate-pulse" />

                        {/* Variants */}
                        <div className="space-y-3">
                            <div className="h-5 bg-muted/40 rounded-md w-24 animate-pulse" />
                            <div className="flex gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-14 w-32 bg-muted/40 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="h-20 bg-muted/20 rounded-xl w-full animate-pulse border border-border/40" />

                        {/* Buttons */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-14 bg-muted/60 rounded-xl animate-pulse" />
                                <div className="h-14 bg-muted/40 rounded-xl animate-pulse" />
                            </div>
                            <div className="h-14 bg-muted/60 rounded-xl animate-pulse" />
                        </div>
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
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8">
            <div className="grid lg:grid-cols-12 gap-8 xl:gap-14">
                {/* Left Column: Images */}
                <div className="lg:col-span-6 relative">
                    <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-[#1e293b] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
                                Group Buy
                            </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-all duration-200 ${isLiked
                                    ? "bg-[#1e293b] text-red-500"
                                    : "bg-[#1e293b]/80 hover:bg-[#1e293b] text-muted-foreground hover:text-red-500"
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                            </button>
                        </div>
                        <ProductCarousel images={product.product_images || []} />
                    </div>
                </div>

                {/* Right Column: Product Info & Actions */}
                <div className="lg:col-span-6 flex flex-col gap-6">

                    {/* Header */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="flex text-[#10b981]">
                                {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                <Star className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">(35 Reviews)</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <span className="text-4xl font-bold text-foreground">
                            Rp. {formatPrice(currentPrice)}
                        </span>
                    </div>

                    {/* Variant Selector */}
                    {hasVariants && (
                        <div className="space-y-3 pt-2">
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
                                                 group relative flex items-center gap-3 px-4 py-2 rounded-xl border transition-all
                                                 ${isSelected
                                                    ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                                                    : "border-border hover:border-[#10b981]/50 text-foreground"
                                                }
                                                 ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-secondary/50" : "cursor-pointer"}
                                             `}
                                        >
                                            <div className="relative w-8 h-8 rounded overflow-hidden bg-white shrink-0 border border-border/20">
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

                                            {isSelected && (
                                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#10b981] rounded-bl-md rounded-tr-md" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-8 border-y border-border/50 py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                disabled={quantity >= currentStock}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 disabled:opacity-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-sm">
                            <span className="text-amber-500 font-medium block">Only {currentStock} items left!</span>
                            <span className="text-muted-foreground text-xs">Don't miss out.</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                className="h-14 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/20"
                                disabled={currentStock === 0}
                            >
                                Buy Now
                            </Button>
                            <Button
                                variant="outline"
                                className="h-14 border-2 border-muted-foreground/20 font-bold text-lg rounded-xl bg-transparent hover:bg-accent/10"
                                disabled={currentStock === 0}
                            >
                                Add to Cart
                            </Button>
                        </div>
                        <Button
                            className="w-full h-14 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/20 relative overflow-hidden group"
                            onClick={() => router.push(`/group-buy/discovery/${selectedVariantId}`)}
                            disabled={!selectedVariant?.group_buy_sessions || selectedVariant.group_buy_sessions.length === 0}
                        >
                            <span className="relative z-10 flex items-center gap-2 justify-center">
                                <Users className="w-5 h-5" />
                                Start Group Buy
                            </span>
                            {selectedVariant?.group_buy_sessions?.length > 0 && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-[#4f46e5] text-xs font-bold px-2 py-0.5 rounded-full">
                                    {selectedVariant.group_buy_sessions.length} Active
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Info Sections */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
                            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-[#10b981]" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold text-foreground mb-0.5">Community Buy</p>
                                <p className="text-muted-foreground leading-tight">
                                    Join others to unlock lower prices. <span className="text-[#10b981] cursor-pointer hover:underline">Learn more</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
                            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
                                <Truck className="w-5 h-5 text-[#10b981]" />
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold text-foreground mb-0.5">Express Delivery</p>
                                <p className="text-muted-foreground leading-tight">
                                    Free shipping on orders over 500k. <span className="text-[#10b981] cursor-pointer hover:underline">Policy</span>
                                </p>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

            {/* Description Section */}
            <div className="mt-20 max-w-5xl mx-auto border-t border-border pt-10">
                <h2 className="text-3xl font-bold text-foreground mb-8">Product Description</h2>
                <div
                    className="prose prose-lg prose-invert max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />
            </div>
        </div>
    );
}