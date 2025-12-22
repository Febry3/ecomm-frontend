"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateGroupBuySession } from "@/services/api/group-buy-service"
import { useGetSellerProductsQuery } from "@/services/api/product-service"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Image from "next/image"
import { Users, Percent, Calendar, Package, Info, Sparkles, TrendingUp, Plus, XCircle } from "lucide-react"

// Zod validation schema
const discountTierSchema = z.object({
    minParticipants: z.number().min(1, "Minimum 1 participant"),
    discountPercentage: z.number().min(1, "Minimum 1%").max(50, "Maximum 50%"),
})

const groupBuyFormSchema = z.object({
    selectedProductId: z.string().min(1, "Please select a product"),
    selectedVariantId: z.string().min(1, "Please select a variant"),
    maxParticipants: z.number().min(2, "Minimum 2 participants").max(1000, "Maximum 1000 participants"),
    maxQuantity: z.number().min(1, "Minimum quantity is 1"),
    expiresInDays: z.number().min(1, "Minimum 1 day").max(30, "Maximum 30 days"),
    discountTiers: z.array(discountTierSchema).min(1, "At least one discount tier required"),
    autoActivate: z.boolean(),
})

type GroupBuyFormData = z.infer<typeof groupBuyFormSchema>

interface CreateGroupBuyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function CreateGroupBuyDialog({ open, onOpenChange, onSuccess }: CreateGroupBuyDialogProps) {
    const [step, setStep] = useState(1)
    const { mutate: createGroupBuy, isPending: isLoading } = useCreateGroupBuySession()
    const { data: productsData } = useGetSellerProductsQuery()

    // Transform products data for the dialog
    const products = useMemo(() => {
        if (!productsData?.products) return []
        return productsData.products.map((product) => ({
            id: product.id,
            title: product.title,
            image: product.product_images?.[0]?.image_url || "/placeholder.svg",
            variants: product.variants?.map((variant) => ({
                id: variant.id || "",
                name: variant.name,
                price: variant.price,
                stock: variant.stock?.current_stock || 0,
            })) || [],
        }))
    }, [productsData])

    // Form with Zod validation
    const form = useForm<GroupBuyFormData>({
        resolver: zodResolver(groupBuyFormSchema),
        defaultValues: {
            selectedProductId: "",
            selectedVariantId: "",
            maxParticipants: 10,
            maxQuantity: 50,
            expiresInDays: 7,
            discountTiers: [
                { minParticipants: 3, discountPercentage: 5 },
                { minParticipants: 5, discountPercentage: 10 },
                { minParticipants: 10, discountPercentage: 15 },
            ],
            autoActivate: true,
        },
    })

    const { watch, setValue, formState: { errors } } = form
    const selectedProductId = watch("selectedProductId")
    const selectedVariantId = watch("selectedVariantId")
    const discountTiers = watch("discountTiers")
    const maxParticipants = watch("maxParticipants")
    const maxQuantity = watch("maxQuantity")
    const expiresInDays = watch("expiresInDays")
    const autoActivate = watch("autoActivate")

    const selectedProduct = products.find((p) => p.id === selectedProductId)
    const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId)

    const calculateDiscountedPrice = (participants: number = maxParticipants) => {
        if (!selectedVariant) return 0
        const applicableTier = [...discountTiers]
            .sort((a, b) => b.minParticipants - a.minParticipants)
            .find((tier) => participants >= tier.minParticipants)
        const discount = applicableTier?.discountPercentage || 0
        return selectedVariant.price * (1 - discount / 100)
    }

    const calculatePotentialRevenue = () => {
        if (!selectedVariant) return 0
        return calculateDiscountedPrice(maxParticipants) * maxParticipants
    }

    const resetForm = () => {
        setStep(1)
        form.reset()
    }

    // Validate step before proceeding
    const validateStep = (currentStep: number): boolean => {
        if (currentStep === 1) {
            const productValid = selectedProductId.length > 0
            const variantValid = selectedVariantId.length > 0
            if (!productValid) {
                toast.error("Please select a product")
                return false
            }
            if (!variantValid) {
                toast.error("Please select a variant")
                return false
            }
            return true
        }
        if (currentStep === 2) {
            if (maxParticipants < 2) {
                toast.error("Max participants must be at least 2")
                return false
            }
            if (maxQuantity < 1) {
                toast.error("Max quantity must be at least 1")
                return false
            }
            if (discountTiers.length === 0) {
                toast.error("At least one discount tier is required")
                return false
            }
            // Validate tier values
            for (const tier of discountTiers) {
                if (tier.minParticipants < 1) {
                    toast.error("Minimum participants must be at least 1")
                    return false
                }
                if (tier.discountPercentage < 1 || tier.discountPercentage > 50) {
                    toast.error("Discount must be between 1% and 50%")
                    return false
                }
            }
            // Check if max participants is greater than highest tier threshold
            const maxTierThreshold = Math.max(...discountTiers.map(t => t.minParticipants))
            if (maxParticipants <= maxTierThreshold) {
                toast.error(`Max participants must be greater than ${maxTierThreshold}`)
                return false
            }
            return true
        }
        return true
    }

    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1)
        }
    }

    const handleCreate = async () => {
        if (!validateStep(2)) return

        // Construct payload matching backend API spec
        const payload = {
            product_variant_id: selectedVariantId,
            min_participants: Math.min(...discountTiers.map(t => t.minParticipants)),
            max_participants: maxParticipants,
            max_quantity: maxQuantity,
            expires_at: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
            tiers: discountTiers.map(tier => ({
                participant_threshold: tier.minParticipants,
                discount_percentage: tier.discountPercentage
            }))
        }

        createGroupBuy(payload, {
            onSuccess: () => {
                onOpenChange(false)
                onSuccess?.()
                resetForm()
            }
        })
    }

    const addDiscountTier = () => {
        const lastTier = discountTiers[discountTiers.length - 1]
        setValue("discountTiers", [
            ...discountTiers,
            {
                minParticipants: lastTier.minParticipants + 2,
                discountPercentage: Math.min(lastTier.discountPercentage + 5, 50),
            },
        ])
    }

    const removeDiscountTier = (index: number) => {
        if (discountTiers.length > 1) {
            setValue("discountTiers", discountTiers.filter((_, i) => i !== index))
        }
    }

    const updateDiscountTier = (index: number, field: "minParticipants" | "discountPercentage", value: number) => {
        const newTiers = [...discountTiers]
        newTiers[index][field] = value
        setValue("discountTiers", newTiers)
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <Select
                    value={selectedProductId}
                    onValueChange={(value) => {
                        setValue("selectedProductId", value)
                        setValue("selectedVariantId", "")
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
                    <Select value={selectedVariantId} onValueChange={(value) => setValue("selectedVariantId", value)}>
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
                    <Label htmlFor="maxParticipants">
                        <Users className="h-4 w-4 inline mr-2" />
                        Max Participants
                    </Label>
                    <Input
                        id="maxParticipants"
                        type="number"
                        min={Math.max(...discountTiers.map((t) => t.minParticipants)) + 1}
                        // max={selectedVariant?.stock || 100} // Removed direct dependency on stock for mapping
                        value={maxParticipants}
                        onChange={(e) => setValue("maxParticipants", Number(e.target.value))}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                        Max joiners allowed
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxQuantity">
                        <Package className="h-4 w-4 inline mr-2" />
                        Campaign Stock
                    </Label>
                    <Input
                        id="maxQuantity"
                        type="number"
                        min={maxParticipants}
                        max={selectedVariant?.stock || 1000}
                        value={maxQuantity}
                        onChange={(e) => setValue("maxQuantity", Number(e.target.value))}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                        Total items for sale
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>
                        <Percent className="h-4 w-4 inline mr-2" />
                        Discount Tiers
                    </Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDiscountTier}
                        disabled={discountTiers.length >= 5}
                        className="h-8"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Tier
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Set different discount rates based on the number of participants
                </p>

                <div className="space-y-3">
                    {discountTiers
                        .sort((a, b) => a.minParticipants - b.minParticipants)
                        .map((tier, index) => (
                            <Card key={index} className="bg-white/5 border-white/10">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Min Participants</Label>
                                                <Input
                                                    type="number"
                                                    min={index === 0 ? 2 : discountTiers[index - 1].minParticipants + 1}
                                                    max={
                                                        index < discountTiers.length - 1
                                                            ? discountTiers[index + 1].minParticipants - 1
                                                            : maxParticipants
                                                    }
                                                    value={tier.minParticipants}
                                                    onChange={(e) => updateDiscountTier(index, "minParticipants", Number(e.target.value))}
                                                    className="h-9 bg-white/5 border-white/10"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Discount %</Label>
                                                <Input
                                                    type="number"
                                                    min={5}
                                                    max={50}
                                                    step={5}
                                                    value={tier.discountPercentage}
                                                    onChange={(e) => updateDiscountTier(index, "discountPercentage", Number(e.target.value))}
                                                    className="h-9 bg-white/5 border-white/10"
                                                />
                                            </div>
                                        </div>
                                        {discountTiers.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeDiscountTier(index)}
                                                className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {tier.minParticipants}+ buyers get {tier.discountPercentage}% off (Rp{" "}
                                        {selectedVariant
                                            ? (selectedVariant.price * (1 - tier.discountPercentage / 100)).toLocaleString("id-ID")
                                            : "0"}
                                        )
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiresIn">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Campaign Duration
                </Label>
                <Select value={expiresInDays.toString()} onValueChange={(v) => setValue("expiresInDays", Number(v))}>
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
                <Switch id="autoActivate" checked={autoActivate} onCheckedChange={(checked) => setValue("autoActivate", checked)} />
            </div>
        </div>
    )

    const renderStep3 = () => {
        const minTier = discountTiers[0]
        const maxTier = discountTiers[discountTiers.length - 1]

        return (
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

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Original Price:</span>
                                <span className="font-medium">Rp {selectedVariant?.price.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Max Participants:</span>
                                <span className="font-medium">{maxParticipants} joiners</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Campaign Stock:</span>
                                <span className="font-medium">{maxQuantity} items</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{expiresInDays} days</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Auto-activate:</span>
                                <span className="font-medium">{autoActivate ? "Yes" : "No"}</span>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Discount Tiers:</p>
                            {discountTiers
                                .sort((a, b) => a.minParticipants - b.minParticipants)
                                .map((tier, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm bg-white/5 p-2 rounded">
                                        <span className="text-muted-foreground">{tier.minParticipants}+ participants</span>
                                        <span className="font-medium text-green-400">
                                            {tier.discountPercentage}% off (Rp{" "}
                                            {selectedVariant
                                                ? (selectedVariant.price * (1 - tier.discountPercentage / 100)).toLocaleString("id-ID")
                                                : "0"}
                                            )
                                        </span>
                                    </div>
                                ))}
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
                        Customers will unlock higher discounts as more participants join. The campaign will automatically expire
                        after {expiresInDays} days if minimum participants are not reached.
                    </p>
                </div>
            </div>
        )
    }

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
                            onClick={handleNextStep}
                            disabled={
                                (step === 1 && !selectedVariantId) || (step === 2 && (!maxParticipants || !maxQuantity || discountTiers.length === 0))
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
