"use client"

import ProductForum from "@/components/ProductForum"

export default function ForumsPage() {
    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Community Forums</h1>
                <ProductForum />
            </div>
        </div>
    )
}
