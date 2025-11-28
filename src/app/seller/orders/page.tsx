"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Package, Truck, CheckCircle, XCircle, Printer } from "lucide-react"

const orders = [
    {
        id: "ORD-1001",
        customer: "Ahmad Suryadi",
        items: 2,
        total: 792350,
        status: "pending",
        date: "2024-01-28",
    },
    {
        id: "ORD-1002",
        customer: "Siti Nurhaliza",
        items: 1,
        total: 467350,
        status: "processing",
        date: "2024-01-27",
    },
    {
        id: "ORD-1003",
        customer: "Budi Santoso",
        items: 3,
        total: 1256000,
        status: "shipped",
        date: "2024-01-26",
    },
]

const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500", icon: Package },
    processing: { label: "Processing", color: "bg-blue-500/10 text-blue-500", icon: Package },
    shipped: { label: "Shipped", color: "bg-purple-500/10 text-purple-500", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-500", icon: XCircle },
}

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage and fulfill customer orders</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline">
                            <Printer className="h-4 w-4 mr-2" />
                            Bulk Print
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Orders</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="processing">Processing</TabsTrigger>
                            <TabsTrigger value="shipped">Shipped</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4 mt-4">
                            {orders.map((order) => (
                                <Card key={order.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{order.id}</p>
                                                    <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                                                        {statusConfig[order.status as keyof typeof statusConfig].label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{order.customer}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.items} items • {order.date}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className="text-lg font-bold">Rp {order.total.toLocaleString()}</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                    {order.status === "pending" && <Button size="sm">Accept Order</Button>}
                                                    {order.status === "processing" && <Button size="sm">Ship Order</Button>}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
