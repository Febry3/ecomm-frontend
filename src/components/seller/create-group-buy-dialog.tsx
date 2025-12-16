"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, Percent, Calendar, Package, Info, Sparkles, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Product {
    id: string
    title: string
    image: string
    variants: {
        id: string
        name: string
        price: number
        stock: number
    }[]
}

interface CreateGroupBuyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    products: Product[]
    onSuccess?: () => void
}

export function CreateGroupBuyDialog({ open, onOpenChange, products, onSuccess }: CreateGroupBuyDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)

    // Form state based on database schema
    const [selectedProductId, setSelectedProductId] = useState("")
    const [selectedVariantId, setSelectedVariantId] = useState("")
    const [minParticipants, setMinParticipants] = useState(3)
    const [maxParticipants, setMaxParticipants] = useState(10)
    const [discountPercentage, setDiscountPercentage] = useState(15)
    const [expiresInDays, setExpiresInDays] = useState(7)
    const [autoActivate, setAutoActivate] = useState(true)

    const selectedProduct = products.find((p) => p.id === selectedProductId)
    const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId)

    const calculateDiscountedPrice = () => {
        if (!selectedVariant) return 0
        return selectedVariant.price * (1 - discountPercentage / 100)
    }

    const calculatePotentialRevenue = () => {
        if (!selectedVariant) return 0
        return calculateDiscountedPrice() * maxParticipants
    }

    const handleCreate = async () => {
        if (!selectedVariantId || !minParticipants || !maxParticipants || !discountPercentage) {
            toast("Please fill in all required fields.")
            return
        }

        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast("Group Buy Session Created")

        setIsLoading(false)
        onOpenChange(false)
        onSuccess?.()

        // Reset form
        setStep(1)
        setSelectedProductId("")
        setSelectedVariantId("")
        setMinParticipants(3)
        setMaxParticipants(10)
        setDiscountPercentage(15)
        setExpiresInDays(7)
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <Select
                    value={selectedProductId}
                    onValueChange={(value) => {
                        setSelectedProductId(value)
                        setSelectedVariantId("")
                    }}
                >
                    <SelectTrigger id="product">
                        <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.title}
                                        width={24}
                                        height={24}
                                        className="rounded"
                                    />
                                    {product.title}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedProduct && (
                <div className="space-y-2">
                    <Label htmlFor="variant">Select Variant</Label>
                    <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                        <SelectTrigger id="variant">
                            <SelectValue placeholder="Choose a variant" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedProduct.variants.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id}>
                                    <div className="flex items-center justify-between gap-4">
                                        <span>{variant.name}</span>
                                        <span className="text-muted-foreground">
                                            Rp {variant.price.toLocaleString("id-ID")} ({variant.stock} in stock)
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {selectedVariant && (
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={selectedProduct?.image || ""}
                                alt={selectedProduct?.title || ""}
                                width={80}
                                height={80}
                                className="rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold">{selectedProduct?.title}</h4>
                                <p className="text-sm text-muted-foreground">{selectedVariant.name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">
                                        <Package className="h-3 w-3 mr-1" />
                                        {selectedVariant.stock} in stock
                                    </Badge>
                                    <Badge className="bg-accent/20 text-accent">Rp {selectedVariant.price.toLocaleString("id-ID")}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="minParticipants">
                        <Users className="h-4 w-4 inline mr-2" />
                        Min Participants
                    </Label>
                    <Input
                        id="minParticipants"
                        type="number"
                        min={2}
                        max={maxParticipants - 1}
                        value={minParticipants}
                        onChange={(e) => setMinParticipants(Number(e.target.value))}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">Minimum buyers needed to activate discount</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxParticipants">
                        <Users className="h-4 w-4 inline mr-2" />
                        Max Participants
                    </Label>
                    <Input
                        id="maxParticipants"
                        type="number"
                        min={minParticipants + 1}
                        max={selectedVariant?.stock || 100}
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">Maximum buyers allowed (limited by stock)</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>
                        <Percent className="h-4 w-4 inline mr-2" />
                        Discount Percentage
                    </Label>
                    <span className="text-2xl font-bold text-accent">{discountPercentage}%</span>
                </div>
                <Slider
                    value={[discountPercentage]}
                    onValueChange={([value]) => setDiscountPercentage(value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>25%</span>
                    <span>50%</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiresIn">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Campaign Duration
                </Label>
                <Select value={expiresInDays.toString()} onValueChange={(v) => setExpiresInDays(Number(v))}>
                    <SelectTrigger id="expiresIn" className="bg-white/5 border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="space-y-1">
                    <Label htmlFor="autoActivate">Auto-activate when minimum reached</Label>
                    <p className="text-xs text-muted-foreground">Automatically process orders when min participants join</p>
                </div>
                <Switch id="autoActivate" checked={autoActivate} onCheckedChange={setAutoActivate} />
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center pb-4">
                <Sparkles className="h-12 w-12 mx-auto text-accent mb-2" />
                <h3 className="text-lg font-semibold">Review Your Group Buy Campaign</h3>
                <p className="text-sm text-muted-foreground">Confirm the details below before launching</p>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <Image
                            src={selectedProduct?.image || ""}
                            alt={selectedProduct?.title || ""}
                            width={60}
                            height={60}
                            className="rounded-lg"
                        />
                        <div>
                            <h4 className="font-semibold">{selectedProduct?.title}</h4>
                            <p className="text-sm text-muted-foreground">{selectedVariant?.name}</p>
                        </div>
                    </div>
                    <Separator className="bg-white/10" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Participants:</span>
                                <span className="font-medium">
                                    {minParticipants} - {maxParticipants}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Discount:</span>
                                <span className="font-medium text-green-500">{discountPercentage}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{expiresInDays} days</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Original Price:</span>
                                <span className="font-medium">Rp {selectedVariant?.price.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Discounted Price:</span>
                                <span className="font-medium text-accent">Rp {calculateDiscountedPrice().toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Auto-activate:</span>
                                <span className="font-medium">{autoActivate ? "Yes" : "No"}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-accent" />
                        <div>
                            <p className="text-sm text-muted-foreground">Potential Revenue (if max reached)</p>
                            <p className="text-2xl font-bold">Rp {calculatePotentialRevenue().toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                    Once created, you can share the group buy link with your customers. The campaign will automatically expire
                    after {expiresInDays} days if minimum participants are not reached.
                </p>
            </div>
        </div>
    )

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-[550px] bg-background border-white/10 p-0 flex flex-col h-full overflow-hidden"
            >
                <SheetHeader className="p-6 pb-0 shrink-0">
                    <SheetTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Create Group Buy Session
                    </SheetTitle>
                    <SheetDescription>
                        Set up a group buying campaign to offer discounts when multiple customers buy together.
                    </SheetDescription>
                </SheetHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 py-4 px-6 shrink-0">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? "bg-accent text-accent-foreground" : "bg-white/10 text-muted-foreground"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-0.5 mx-1 transition-colors ${step > s ? "bg-accent" : "bg-white/10"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-6">
                    <div className="py-4">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>
                </div>

                <SheetFooter className="p-6 pt-4 border-t border-white/10 gap-2 shrink-0">
                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)} className="bg-transparent">
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !selectedVariantId) ||
                                (step === 2 && (!minParticipants || !maxParticipants || !discountPercentage))
                            }
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Launch Campaign"}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
