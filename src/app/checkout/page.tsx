"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useGetProduct } from "@/services/api/product-service"
import { useGetAllUserAddress } from "@/services/api/address-service"
import { useCreateOrder, CreateOrderResponse } from "@/services/api/order-service"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Loader2, CheckCircle2, Copy, Building2, Wallet, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Product } from "@/types/product"
import { Address } from "@/types/address"

const BANK_OPTIONS = [
    { code: "bca", name: "BCA", logo: "/banks/bca.png" }, // logos are placeholders
    { code: "bni", name: "BNI", logo: "/banks/bni.png" },
    { code: "mandiri", name: "Mandiri", logo: "/banks/mandiri.png" },
    { code: "permata", name: "Permata", logo: "/banks/permata.png" },
]

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const productId = searchParams.get("productId")
    const variantId = searchParams.get("variantId")
    const quantityParam = searchParams.get("quantity")
    const quantity = quantityParam ? parseInt(quantityParam) : 1

    const { data: productData, isLoading: isProductLoading } = useGetProduct(productId || "")
    const { data: addressesData, isLoading: isAddressLoading } = useGetAllUserAddress()
    const { mutate: createOrder, isPending: isOrderPending } = useCreateOrder()

    const [selectedAddressId, setSelectedAddressId] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer")
    const [selectedBank, setSelectedBank] = useState<string>("")
    const [orderSuccess, setOrderSuccess] = useState<CreateOrderResponse | null>(null)
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)

    const product = productData as Product | undefined
    const addresses = addressesData as Address[] | undefined

    // Set default address
    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find((a) => a.is_default)
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.address_id)
            } else {
                setSelectedAddressId(addresses[0].address_id)
            }
        }
    }, [addresses, selectedAddressId])

    if (!productId || !variantId) {
        return <div className="p-10 text-center">Invalid Checkout Request</div>
    }

    if (isProductLoading || isAddressLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const selectedVariant = product?.variants?.find((v) => v.id === variantId)

    if (!selectedVariant) {
        return <div className="p-10 text-center">Variant not found</div>
    }

    const price = selectedVariant.price
    const subtotal = price * quantity
    const deliveryCharge: number = 0
    const totalAmount = subtotal + deliveryCharge

    const selectedAddress = addresses?.find((a) => a.address_id === selectedAddressId)

    const handlePlaceOrder = () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address")
            return
        }
        if (paymentMethod === "bank_transfer" && !selectedBank) {
            toast.error("Please select a bank")
            return
        }

        createOrder({
            product_variant_id: variantId,
            quantity: quantity,
            address_id: selectedAddressId,
            bank_code: selectedBank,
        }, {
            onSuccess: (data) => {
                setOrderSuccess(data)
                window.scrollTo(0, 0)
            }
        })
    }

    const handleCopyVa = (va: string) => {
        navigator.clipboard.writeText(va)
        toast.success("VA Number copied")
    }

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-background py-10 px-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="border-green-500/20 bg-green-500/5">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
                                <p className="text-muted-foreground">Please complete your payment before it expires.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Bank</p>
                                    <p className="font-semibold text-lg uppercase">{orderSuccess.payment.bank_code}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="font-bold text-xl text-primary">Rp {orderSuccess.total_amount.toLocaleString("id-ID")}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Virtual Account Number</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-3 bg-muted rounded-md font-mono text-lg font-medium tracking-wider">
                                        {orderSuccess.payment.va_number}
                                    </div>
                                    <Button size="icon" variant="outline" onClick={() => handleCopyVa(orderSuccess.payment.va_number)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Number</span>
                                    <span className="font-medium">{orderSuccess.order_number}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="outline" className="capitalize">{orderSuccess.status.replace("_", " ")}</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Expires At</span>
                                    <span className="font-medium text-red-500">
                                        {new Date(orderSuccess.payment.expired_at).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => router.push("/orders")}>
                                View My Orders
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Defensive check to avoid null access
    if (!product) return null

    return (
        <div className="min-h-screen bg-background py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-8 space-y-6">
                    <h1 className="text-3xl font-bold">Checkout</h1>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Shipping Address</CardTitle>
                            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="text-primary">Change</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Select Address</DialogTitle>
                                    </DialogHeader>
                                    <RadioGroup value={selectedAddressId} onValueChange={(val) => {
                                        setSelectedAddressId(val)
                                        setIsAddressDialogOpen(false)
                                    }} className="grid gap-4 py-4">
                                        {addresses?.map((addr) => (
                                            <div key={addr.address_id} className="flex items-center space-x-2 border p-3 rounded-md has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5">
                                                <RadioGroupItem value={addr.address_id} id={addr.address_id} />
                                                <Label htmlFor={addr.address_id} className="cursor-pointer flex-1">
                                                    <div className="font-semibold">{addr.receiver_name} <span className="text-muted-foreground font-normal">({addr.address_label})</span></div>
                                                    <div className="text-sm text-muted-foreground">{addr.street_address}, {addr.city}, {addr.postal_code}</div>
                                                    <div className="text-sm text-muted-foreground">{addr.phone_number}</div>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    <Button variant="outline" onClick={() => window.open("/profile/addresses", "_blank")}>Manage Addresses</Button>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {selectedAddress ? (
                                <div className="space-y-1">
                                    <p className="font-semibold">{selectedAddress.receiver_name} <Badge variant="secondary" className="ml-2">{selectedAddress.address_label}</Badge></p>
                                    <p className="text-muted-foreground">{selectedAddress.street_address}</p>
                                    <p className="text-muted-foreground">{selectedAddress.city}, {selectedAddress.province} {selectedAddress.postal_code}</p>
                                    <p className="text-muted-foreground">{selectedAddress.phone_number}</p>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">No address selected</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" className="peer sr-only" />
                                    <Label
                                        htmlFor="bank_transfer"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer h-full"
                                    >
                                        <Building2 className="mb-3 h-6 w-6" />
                                        <span className="text-sm font-medium">Bank Transfer</span>
                                    </Label>
                                </div>
                                <div className="opacity-50 pointer-events-none">
                                    <RadioGroupItem value="ewallet" id="ewallet" className="peer sr-only" />
                                    <Label
                                        htmlFor="ewallet"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 peer-data-[state=checked]:border-primary cursor-not-allowed h-full"
                                    >
                                        <Wallet className="mb-3 h-6 w-6" />
                                        <span className="text-sm font-medium">E-Wallet (Coming Soon)</span>
                                    </Label>
                                </div>
                                <div className="opacity-50 pointer-events-none">
                                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                    <Label
                                        htmlFor="card"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 peer-data-[state=checked]:border-primary cursor-not-allowed h-full"
                                    >
                                        <CreditCard className="mb-3 h-6 w-6" />
                                        <span className="text-sm font-medium">Card (Coming Soon)</span>
                                    </Label>
                                </div>
                            </RadioGroup>

                            {paymentMethod === "bank_transfer" && (
                                <div className="space-y-4 pt-4 border-t">
                                    <Label className="text-base">Select Bank</Label>
                                    <RadioGroup value={selectedBank} onValueChange={setSelectedBank} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {BANK_OPTIONS.map((bank) => (
                                            <div key={bank.code} className="relative">
                                                <RadioGroupItem value={bank.code} id={bank.code} className="peer sr-only" />
                                                <Label
                                                    htmlFor={bank.code}
                                                    className="flex items-center justify-between rounded-md border border-muted bg-background p-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary cursor-pointer"
                                                >
                                                    <span className="font-semibold">{bank.name}</span>
                                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm line-clamp-2">{product.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{selectedVariant.name}</p>
                                    <p className="text-sm font-medium mt-1">Rp {price.toLocaleString("id-ID")} x {quantity}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span className="text-green-600 font-medium">{deliveryCharge === 0 ? "Free" : `Rp ${deliveryCharge.toLocaleString("id-ID")}`}</span>
                                </div>
                                <div className="flex justify-between mt-4 pt-4 border-t font-bold text-base">
                                    <span>Total Amount</span>
                                    <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold"
                                onClick={handlePlaceOrder}
                                disabled={isOrderPending || !selectedAddressId || (paymentMethod === "bank_transfer" && !selectedBank)}
                            >
                                {isOrderPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
