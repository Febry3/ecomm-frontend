"use client"

import { useGetWallet } from "@/services/api/wallet-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet, ArrowDownLeft, ArrowUpRight, History, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export function UserWallet() {
    const { data: wallet, isLoading } = useGetWallet()
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [bankName, setBankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock API call
        console.log("Withdraw request:", { amount, bankName, accountNumber })

        toast.success("Withdrawal Request Submitted", {
            description: `Request for Rp ${Number(amount).toLocaleString("id-ID")} has been received.`,
        })

        setOpen(false)
        setAmount("")
        setBankName("")
        setAccountNumber("")
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                    Rp {wallet?.balance.toLocaleString("id-ID") || 0}
                                </h2>
                            </div>
                        </div>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Withdraw
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Request Withdrawal</DialogTitle>
                                    <DialogDescription>
                                        Funds will be transferred to your bank account within 24 hours.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleWithdraw} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (Rp)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Min. 50.000"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            max={wallet?.balance}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Available: Rp {wallet?.balance.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bank">Bank Name</Label>
                                        <Input
                                            id="bank"
                                            placeholder="e.g. BCA, Mandiri"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="account">Account Number</Label>
                                        <Input
                                            id="account"
                                            type="number"
                                            placeholder="1234..."
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Submit Request</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
