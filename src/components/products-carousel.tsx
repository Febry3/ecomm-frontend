"use client"

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    alt_text: string;
    display_order?: number;
    created_at: string;
}

interface ProductCarouselProps {
    images: ProductImage[];
}

export default function ProductCarousel({ images = [] }: ProductCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [thumbnailStart, setThumbnailStart] = useState(0);
    const maxThumbnails = 5;

    // Sort images by display_order
    const sortedImages = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const visibleThumbnails = sortedImages.slice(thumbnailStart, thumbnailStart + maxThumbnails);

    const handlePrevThumbnails = () => {
        setThumbnailStart(Math.max(0, thumbnailStart - 1));
    };

    const handleNextThumbnails = () => {
        setThumbnailStart(Math.min(sortedImages.length - maxThumbnails, thumbnailStart + 1));
    };

    if (sortedImages.length === 0) {
        return (
            <div className="relative aspect-square bg-card/30 rounded-lg overflow-hidden border border-border/50 flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
            </div>
        );
    }

    return (
        <>
            <div className="relative aspect-square bg-card/30 rounded-lg overflow-hidden border border-border/50 h-[70%] w-full">
                <Image
                    src={sortedImages[selectedIndex]?.image_url || "/placeholder.svg"}
                    alt={sortedImages[selectedIndex]?.alt_text || "Product image"}
                    fill
                    sizes="(min-width: 768px) 500px, 100vw"
                    className="object-cover p-3"
                    priority
                />
            </div>

            {/* Thumbnail Gallery */}
            {sortedImages.length > 1 && (
                <div className="mt-3 grid grid-cols-12 gap-1">
                    {thumbnailStart > 0 && (
                        <button
                            onClick={handlePrevThumbnails}
                            className="hover:cursor-pointer col-span-1 bg-card/30 rounded-lg border flex justify-center items-center"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    {visibleThumbnails.map((img, index) => {
                        const actualIndex = thumbnailStart + index;
                        return (
                            <button
                                key={img.id}
                                onClick={() => setSelectedIndex(actualIndex)}
                                className={`col-span-2 relative aspect-square bg-card/30 rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === actualIndex ? "border-primary" : "border-border/30 hover:border-border"}`}
                            >
                                <Image
                                    src={img.image_url || "/placeholder.svg"}
                                    alt={img.alt_text || `View ${actualIndex + 1}`}
                                    fill
                                    className="object-contain p-2"
                                />
                            </button>
                        );
                    })}
                    {thumbnailStart + maxThumbnails < sortedImages.length && (
                        <button
                            onClick={handleNextThumbnails}
                            className="hover:cursor-pointer col-span-1 bg-card/30 rounded-lg border flex justify-center items-center"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}