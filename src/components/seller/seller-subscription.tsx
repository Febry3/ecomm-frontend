"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Crown, Shield, Loader2 } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface SubscriptionPlan {
    id: "free" | "plus" | "extra"
    name: string
    price: string
    commission: string
    description: string
    features: string[]
    icon: any
    highlighted?: boolean
}

const plans: SubscriptionPlan[] = [
    {
        id: "free",
        name: "Starter",
        price: "Free",
        commission: "5% Commission",
        description: "Perfect for new sellers just getting started.",
        features: [
            "Basic Dashboard",
            "Up to 50 Products",
            "Standard Support",
            "Basic Analytics"
        ],
        icon: Shield
    },
    {
        id: "plus",
        name: "Plus",
        price: "Rp 149.000/mo",
        commission: "3% Commission",
        description: "For growing businesses needing more power.",
        features: [
            "Advanced Dashboard",
            "Unlimited Products",
            "Priority Support",
            "Advanced Sales Analytics",
            "Marketing Tools"
        ],
        icon: Zap,
        highlighted: true
    },
    {
        id: "extra",
        name: "Enterprise",
        price: "Rp 499.000/mo",
        commission: "1% Commission",
        description: "Maximum scale and lowest fees for volume sellers.",
        features: [
            "All Plus Features",
            "Dedicated Account Manager",
            "Lowest Commission Rate",
            "Custom API Access",
            "Early Access to Features",
            "White Label Options"
        ],
        icon: Crown
    }
]

export function SellerSubscription() {
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        if (!selectedPlan) return
        setLoading(true)

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success("Upgrade Successful!", {
            description: `You are now subscribed to the ${selectedPlan.name} plan.`
        })

        setLoading(false)
        setSelectedPlan(null)
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold">Choose Your Seller Plan</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Unlock lower commission rates and advanced tools to skyrocket your sales.
                    Change your plan anytime.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const Icon = plan.icon
                    const isFree = plan.id === "free"
                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.highlighted
                                ? "border-primary shadow-lg scale-105 z-10"
                                : "border-border"
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${plan.highlighted ? "bg-primary/20" : "bg-muted"}`}>
                                        <Icon className={`w-6 h-6 ${plan.highlighted ? "text-primary" : "text-foreground"}`} />
                                    </div>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                </div>
                                <div className="mb-2 flex flex-col items-start">
                                    {!isFree ? (
                                        <div className="flex flex-col">
                                            <span className="text-lg text-muted-foreground line-through decoration-destructive decoration-2">
                                                {plan.price}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-primary">Free</span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                    Limited Offer
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                    )}
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mb-6 p-3 bg-muted/50 rounded-lg text-center font-medium border border-border">
                                    {plan.commission}
                                </div>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="w-5 h-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={plan.highlighted ? "default" : "outline"}
                                    size="lg"
                                    disabled={isFree}
                                    onClick={() => !isFree && setSelectedPlan(plan)}
                                >
                                    {isFree ? "Current Plan" : "Claim Free Upgrade"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Upgrade</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to upgrade to the <span className="font-semibold text-primary">{selectedPlan?.name}</span> plan?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-1">
                                <p className="font-medium">New Plan</p>
                                <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm line-through text-muted-foreground">{selectedPlan?.price}</p>
                                <p className="font-bold text-primary">Free</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedPlan(null)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpgrade} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Upgrade
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
