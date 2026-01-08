"use client"

import { useGetOrders } from "@/services/api/order-service"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, Search, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

export default function OrdersPage() {
    const { data: orders, isLoading } = useGetOrders()
    const [searchTerm, setSearchTerm] = useState("")

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        )
    }

    const filteredOrders = orders?.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
                        <p className="text-muted-foreground">Managing your order history</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-9 bg-card/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {!orders || orders.length === 0 ? (
                    <Card className="bg-card/50 backdrop-blur border-border p-12 text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-accent" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
                            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        </div>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders?.map((order) => (
                            <Card key={order.id} className="bg-card/50 backdrop-blur border-border p-4 md:p-6 transition-all hover:bg-card/80">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative w-full md:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={order.product.image_url || "/placeholder.svg"}
                                            alt={order.product.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">#{order.order_number}</span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="font-semibold text-foreground text-lg">{order.product.product_name}</h3>
                                                {order.product.variant_name && (
                                                    <p className="text-sm text-muted-foreground">Variant: {order.product.variant_name}</p>
                                                )}
                                            </div>
                                            <Badge
                                                variant={order.payment.status === "PAID" ? "default" : "outline"}
                                                className={
                                                    order.payment.status === "PAID"
                                                        ? "bg-green-500 hover:bg-green-600 border-0"
                                                        : order.payment.status === "PENDING"
                                                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                                }
                                            >
                                                {order.payment.status === "PENDING" ? "Waiting Payment" : order.payment.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                                <p className="font-bold text-accent">Rp {order.total_amount.toLocaleString("id-ID")}</p>
                                            </div>
                                            {order.payment.status === "PENDING" && (
                                                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2" asChild>
                                                    <Link href={`/group-buy/${order.payment.id}?from=orders`}>
                                                        <span>Pay Now</span>
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>

                                        {/* Quick Payment Info for Pending */}
                                        {order.payment.status === "PENDING" && (
                                            <div className="bg-accent/5 rounded-md p-3 flex items-center justify-between border border-accent/10">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Virtual Account ({order.payment.bank_code})</span>
                                                    <span className="font-mono font-medium text-foreground">{order.payment.va_number}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                                                    navigator.clipboard.writeText(order.payment.va_number)
                                                    toast.success("Copied to clipboard")
                                                }}>
                                                    <span className="text-xs">Copy</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
