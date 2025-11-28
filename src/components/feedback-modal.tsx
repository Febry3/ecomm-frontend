"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function FeedbackModal() {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.warning("Please select a rating before submitting.")
            return
        }

        if (!feedback.trim()) {
            toast.warning("Please provide your feedback before submitting.")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("[v0] Feedback submitted:", { rating, feedback, email })

        toast.success("Thank you for your feedback!")

        // Reset form
        setRating(0)
        setFeedback("")
        setEmail("")
        setIsSubmitting(false)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-transparent"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="sr-only">Give Feedback</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
                    <DialogDescription>Help us improve your experience. Your feedback is valuable to us.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-base">
                                How would you rate your experience?
                            </Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="feedback" className="text-base">
                                Tell us more about your experience
                            </Label>
                            <Textarea
                                id="feedback"
                                placeholder="What did you like? What could we improve?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base">
                                Email (optional)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                We'll only use this to follow up on your feedback if needed.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>Submitting...</>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Feedback
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
