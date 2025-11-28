"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const reviews = [
    {
        id: "1",
        customer: "Ahmad Suryadi",
        product: "Gaming Keyboard RGB",
        rating: 5,
        comment: "Produk sangat bagus! Pengiriman cepat dan respon seller ramah.",
        date: "2024-01-28",
    },
    {
        id: "2",
        customer: "Siti Nurhaliza",
        product: "Wireless Gaming Mouse",
        rating: 4,
        comment: "Barang sesuai deskripsi, packing rapi. Recommended seller!",
        date: "2024-01-27",
    },
]

const ratingBreakdown = [
    { stars: 5, count: 89, percentage: 57 },
    { stars: 4, count: 45, percentage: 29 },
    { stars: 3, count: 15, percentage: 10 },
    { stars: 2, count: 4, percentage: 3 },
    { stars: 1, count: 3, percentage: 1 },
]

export default function ReviewsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
                <p className="text-muted-foreground">Monitor customer feedback and store reputation</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Store Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold">4.8</div>
                                <div className="flex items-center justify-center gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">156 reviews</p>
                            </div>
                            <div className="flex-1 space-y-2">
                                {ratingBreakdown.map((rating) => (
                                    <div key={rating.stars} className="flex items-center gap-2">
                                        <span className="text-sm w-8">{rating.stars}★</span>
                                        <Progress value={rating.percentage} className="flex-1" />
                                        <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rating Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Communication</span>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">4.9</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Shipping Speed</span>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">4.7</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Product Accuracy</span>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-semibold">4.8</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-border pb-4 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold">{review.customer}</p>
                                    <p className="text-sm text-muted-foreground">{review.product}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm mb-2">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
