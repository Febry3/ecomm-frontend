"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export interface BannerSlide {
    id: number
    image: string
    title: string
    description?: string
    buttonText: string
    buttonLink: string
    backgroundImage?: string
}

interface MainBannerProps {
    slides: BannerSlide[]
}

export function MainBanner({ slides }: MainBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    const currentBanner = slides[currentSlide]

    return (
        <div className="relative w-full">
            <div className="relative w-full mx-auto">
                <div
                    className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-opacity-10"
                    style={
                        currentBanner.backgroundImage
                            ? {
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),url(${currentBanner.backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                opacity: 10,
                            }
                            : undefined
                    }
                >
                    {/* Content Grid */}
                    <div className="relative grid md:grid-cols-[300px_1fr] gap-8 items-center">
                        {/* Left: Product Image */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                            <Image
                                src={currentBanner.image || "/placeholder.svg"}
                                alt={currentBanner.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Right: Content */}
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold  leading-tight">
                                    {currentBanner.title}
                                </h2>
                                {currentBanner.description && (
                                    <p className="text-lg max-w-xl">{currentBanner.description}</p>
                                )}
                            </div>

                            <div>
                                <Button
                                    type="button"
                                    size="lg"
                                    className="font-semibold px-8"
                                    onClick={() => {
                                        window.location.href = currentBanner.buttonLink
                                    }}
                                >
                                    {currentBanner.buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows (only show if multiple slides) */}
                    {slides.length > 1 && (
                        <>
                            <Button
                                type="button"
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </Button>
                            <Button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full  bg-primary/20 hover:bg-primary/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </Button>
                        </>
                    )}

                    {/* Carousel Dots */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-6 right-6 flex gap-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
