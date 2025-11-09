"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, X, Copy, Check } from "lucide-react"
import type { GroupBuySession } from "@/types/group-buy"

interface GroupBuySessionProps {
    session: GroupBuySession
}

export function GroupBuySessionComponent({ session }: GroupBuySessionProps) {
    const [currentStep, setCurrentStep] = useState<"cart" | "payment" | "success">(session.status)
    const [showAllParticipants, setShowAllParticipants] = useState(false)
    const [couponCode, setCouponCode] = useState("")
    const [copiedLink, setCopiedLink] = useState(false)

    const displayedParticipants = showAllParticipants ? session.participants : session.participants.slice(0, 5)

    const handleCopyInviteLink = () => {
        const link = `${window.location.origin}/group-buy/join/${session.sessionCode}`
        navigator.clipboard.writeText(link)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
    }

    const handleStepClick = (step: "cart" | "payment" | "success") => {
        if (step === "cart") {
            setCurrentStep("cart")
        } else if (
            step === "payment" &&
            (currentStep === "cart" || currentStep === "payment" || currentStep === "success")
        ) {
            setCurrentStep("payment")
        } else if (step === "success" && currentStep === "success") {
            setCurrentStep("success")
        }
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Product Summary Card */}
                <Card className="bg-card/50 backdrop-blur border-border p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={session.product.image || "/placeholder.svg"}
                                alt={session.product.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-3">
                            <h1 className="text-xl md:text-2xl font-semibold text-foreground">{session.product.title}</h1>
                            <p className="text-sm text-muted-foreground">Keyboard Gaming 65% Fantech MAXFIT.</p>
                            <p className="text-xs text-muted-foreground">Hotswap mechanical dengan Knob</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(session.product.rating)
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "fill-muted text-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">({session.product.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-lg text-muted-foreground line-through">
                                    Rp. {session.product.originalPrice.toLocaleString("id-ID")}
                                </span>
                                <span className="text-2xl font-bold text-accent">
                                    Rp. {session.product.discountedPrice.toLocaleString("id-ID")}
                                </span>
                                <Badge variant="secondary" className="bg-accent/20 text-accent">
                                    {session.participants.length} People Joined
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Delivery Policy</span>
                                <span className="text-accent">
                                    Learn about Our Delivery Policy Here <span className="underline cursor-pointer">Details</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 md:gap-12">
                    <div
                        className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => handleStepClick("cart")}
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentStep === "cart" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            1
                        </div>
                        <span
                            className={`text-sm ${currentStep === "cart" ? "text-foreground font-medium" : "text-muted-foreground"}`}
                        >
                            Cart - Group Buying
                        </span>
                    </div>
                    <div
                        className={`w-16 md:w-32 h-0.5 transition-colors ${currentStep === "payment" || currentStep === "success" ? "bg-accent" : "bg-muted"
                            }`}
                    />
                    <div
                        className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => handleStepClick("payment")}
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentStep === "payment" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            2
                        </div>
                        <span
                            className={`text-sm ${currentStep === "payment" ? "text-foreground font-medium" : "text-muted-foreground"}`}
                        >
                            Payment
                        </span>
                    </div>
                    <div
                        className={`w-16 md:w-32 h-0.5 transition-colors ${currentStep === "success" ? "bg-accent" : "bg-muted"}`}
                    />
                    <div
                        className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => handleStepClick("success")}
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${currentStep === "success" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            3
                        </div>
                        <span
                            className={`text-sm ${currentStep === "success" ? "text-foreground font-medium" : "text-muted-foreground"}`}
                        >
                            Success
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                {currentStep === "cart" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Participants */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-foreground">Group Buying #{session.sessionCode}</h2>
                                <Button variant="outline" size="sm" onClick={handleCopyInviteLink} className="gap-2 bg-transparent">
                                    {copiedLink ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Invite Friends
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Card className="bg-card/50 backdrop-blur border-border divide-y divide-border">
                                {displayedParticipants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                                                {participant.avatar ? (
                                                    <Image
                                                        src={participant.avatar || "/placeholder.svg"}
                                                        alt={participant.name}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    participant.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-foreground font-medium">{participant.name}</span>
                                                {participant.isYou && <span className="text-accent ml-2">- You</span>}
                                            </div>
                                        </div>
                                        <span className="text-accent font-medium">× {participant.quantity}</span>
                                    </div>
                                ))}
                            </Card>

                            {session.participants.length > 5 && (
                                <Button
                                    variant="ghost"
                                    className="w-full text-accent hover:text-accent"
                                    onClick={() => setShowAllParticipants(!showAllParticipants)}
                                >
                                    {showAllParticipants ? "See Less" : "See More"}
                                    <ChevronDown
                                        className={`w-4 h-4 ml-2 transition-transform ${showAllParticipants ? "rotate-180" : ""}`}
                                    />
                                </Button>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-4">
                            {/* Coupons */}
                            <Card className="bg-card/50 backdrop-blur border-border p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">Coupons</h3>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Coupons"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 bg-background/50"
                                    />
                                </div>
                                {session.coupon && (
                                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                                        <span className="text-sm text-foreground">{session.coupon.code}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-accent font-medium">LootBox 11:11</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <X className="h-4 w-4 text-accent" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Shipping Address */}
                            <Card className="bg-card/50 backdrop-blur border-border p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">Shipped to (You)</h3>
                                <div className="space-y-1 text-sm">
                                    <p className="text-foreground font-medium">{session.shippingAddress.name}</p>
                                    <p className="text-muted-foreground">{session.shippingAddress.address}</p>
                                </div>
                                <Button variant="link" className="text-accent p-0 h-auto font-normal">
                                    Change Address
                                </Button>
                            </Card>

                            {/* Price Details */}
                            <Card className="bg-card/50 backdrop-blur border-border p-4 space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Price Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">1 Item</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">1x Keyboard Gaming Fantech MAXFIT</span>
                                        <span className="text-foreground">
                                            Rp. {session.priceDetails.itemPrice.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Group Discount</span>
                                        <span className="text-red-500">
                                            - Rp. {session.priceDetails.groupDiscount.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Charges</span>
                                        <span className="text-foreground">
                                            Rp. {session.priceDetails.deliveryCharges.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                                        <span className="text-foreground">TOTAL AMOUNT</span>
                                        <span className="text-accent">Rp. {session.priceDetails.totalAmount.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Place Order Button */}
                            <Button
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                onClick={() => setCurrentStep("payment")}
                            >
                                Place Order →
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === "payment" && (
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-card/50 backdrop-blur border-border p-6 space-y-6">
                            <h2 className="text-2xl font-semibold text-foreground">Payment</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                                    <p className="text-foreground">Total Amount to Pay:</p>
                                    <p className="text-3xl font-bold text-accent">
                                        Rp. {session.priceDetails.totalAmount.toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Please select your payment method:</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                                            <div className="text-left">
                                                <p className="font-medium text-foreground">Bank Transfer</p>
                                                <p className="text-xs text-muted-foreground">Pay via bank transfer</p>
                                            </div>
                                        </Button>
                                        <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                                            <div className="text-left">
                                                <p className="font-medium text-foreground">E-Wallet</p>
                                                <p className="text-xs text-muted-foreground">Pay with GoPay, OVO, DANA</p>
                                            </div>
                                        </Button>
                                        <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                                            <div className="text-left">
                                                <p className="font-medium text-foreground">Credit Card</p>
                                                <p className="text-xs text-muted-foreground">Pay with credit/debit card</p>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                    onClick={() => setCurrentStep("success")}
                                >
                                    Confirm Payment
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {currentStep === "success" && (
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-card/50 backdrop-blur border-border p-8 text-center space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                                <Check className="w-10 h-10 text-accent" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-foreground">Payment Successful!</h2>
                                <p className="text-muted-foreground">Your order has been placed successfully.</p>
                            </div>
                            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 text-left space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order ID:</span>
                                    <span className="text-foreground font-medium">#{session.sessionCode}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Paid:</span>
                                    <span className="text-accent font-bold">
                                        Rp. {session.priceDetails.totalAmount.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">View Order Details</Button>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
