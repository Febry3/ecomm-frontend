"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Star, Package, TrendingUp, AlertCircle } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const salesData = [
    { date: "Jan 22", revenue: 4500 },
    { date: "Jan 23", revenue: 5200 },
    { date: "Jan 24", revenue: 4800 },
    { date: "Jan 25", revenue: 6100 },
    { date: "Jan 26", revenue: 7200 },
    { date: "Jan 27", revenue: 6800 },
    { date: "Jan 28", revenue: 8500 },
]

export default function SellerDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 1,245,350</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+12.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">342</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+8.2%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Store Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 156 reviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground mt-1">Orders awaiting shipment</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <p className="text-sm text-muted-foreground">Last 7 days sales performance</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--primary))" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium">#ORD-{1000 + i}</p>
                                        <p className="text-sm text-muted-foreground">2 items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">Rp {(125000 + i * 50000).toLocaleString()}</p>
                                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500">
                                            Pending
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {["Gaming Keyboard", "Wireless Mouse", "RGB Headset"].map((product, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{product}</p>
                                            <p className="text-sm text-muted-foreground">SKU: PRD-{100 + i}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-orange-500">{3 - i} left</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
