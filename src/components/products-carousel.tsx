"use client"

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const images = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    "https://picsum.photos/1600/900",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    "https://picsum.photos/1600/900",
    "https://picsum.photos/1600/900",
];

export default function ProductCarousel() {
    const [selectedImage, setSelectedImage] = useState({
        startIdx: 0,
        endIdx: 5,
    });

    const [imageCollection, setImageCollection] = useState(images.slice(selectedImage.startIdx, selectedImage.endIdx))

    function handleChange(index: number) {
        setSelectedImage({ startIdx: index, endIdx: index + 5 })
        setImageCollection(images.slice(selectedImage.startIdx, selectedImage.endIdx))
    }

    return (
        <>
            <div className="relative aspect-square bg-card/30 rounded-lg overflow-hidden border border-border/50 h-[70%] w-full">
                <Image
                    src={images[selectedImage.startIdx] || "/placeholder.svg"}
                    alt={"test"}
                    fill sizes="(min-width: 768px) 300px, 100vw"
                    className="object-cover p-3"
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="mt-3 grid grid-cols-12 gap-1">
                {selectedImage.startIdx !== 0 &&
                    <button className="hover:cursor-pointer col-span-1 bg-card/30 rounded-lg border flex justify-center items-center">
                        <ChevronLeft size={24} />
                    </button>
                }
                {imageCollection.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => handleChange(index)}
                        className={`col-span-2 relative aspect-square bg-card/30 rounded-lg overflow-hidden border-2 transition-all ${selectedImage.startIdx === index ? "border-primary" : "border-border/30 hover:border-border"}`}
                    >
                        <Image
                            src={img || "/placeholder.svg"}
                            alt={`view ${index + 1}`}
                            fill
                            className="object-contain p-2"
                        />

                    </button>
                ))}
                {selectedImage.endIdx !== images.length &&
                    <button className="hover:cursor-pointer col-span-1 bg-card/30 rounded-lg border flex justify-center items-center">
                        <ChevronRight size={24} />
                    </button>
                }
            </div>
        </>
    )
}