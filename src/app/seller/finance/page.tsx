"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, Clock, Download } from "lucide-react"

const transactions = [
    {
        id: "TRX-001",
        order: "ORD-1001",
        amount: 742350,
        commission: 50000,
        net: 692350,
        status: "paid",
        date: "2024-01-28",
    },
    {
        id: "TRX-002",
        order: "ORD-1002",
        amount: 467350,
        commission: 30000,
        net: 437350,
        status: "pending",
        date: "2024-01-27",
    },
    {
        id: "TRX-003",
        order: "ORD-1003",
        amount: 1256000,
        commission: 85000,
        net: 1171000,
        status: "paid",
        date: "2024-01-26",
    },
]

export default function FinancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Finance & Payouts</h1>
                <p className="text-muted-foreground">Track your earnings and request withdrawals</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 2,300,700</div>
                        <Button className="w-full mt-4">Request Payout</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 437,350</div>
                        <p className="text-xs text-muted-foreground mt-4">Being processed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 8,956,450</div>
                        <p className="text-xs text-muted-foreground mt-4">All time</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Transaction History</CardTitle>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Sale Amount</TableHead>
                                <TableHead>Commission</TableHead>
                                <TableHead>Net Earnings</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-medium">{txn.id}</TableCell>
                                    <TableCell>{txn.order}</TableCell>
                                    <TableCell>Rp {txn.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-red-500">-Rp {txn.commission.toLocaleString()}</TableCell>
                                    <TableCell className="font-semibold">Rp {txn.net.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={txn.status === "paid" ? "default" : "secondary"}>{txn.status}</Badge>
                                    </TableCell>
                                    <TableCell>{txn.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
