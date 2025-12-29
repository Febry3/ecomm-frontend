"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { createBuyerGroupBuySession, getSessionIdByCode } from "@/services/api/group-buy-service"
import { useGetProductVariant } from "@/services/api/product-service"
import { ArrowLeft, ArrowRight, Plus, Search, Users } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function GroupBuyDiscoveryPage() {
    const router = useRouter()
    // Fetch specific variant if passed (per user request for new API response)
    const searchParams = useSearchParams()
    const variantIdParam = searchParams.get("variantId")
    const { data: selectedVariant, isLoading: isVariantLoading } = useGetProductVariant(variantIdParam || "")

    const [inviteCode, setInviteCode] = useState("")
    const [isJoining, setIsJoining] = useState(false)

    // Create Session State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newSessionTitle, setNewSessionTitle] = useState("")
    const [selectedVariantId, setSelectedVariantId] = useState<string>(variantIdParam || "")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateSession = async () => {
        if (!newSessionTitle.trim()) return

        setIsCreating(true)
        try {
            const sessionId = await createBuyerGroupBuySession({
                productVariantId: selectedVariantId,
                title: newSessionTitle
            })

            toast.success("Session Created!", { description: `Group buy "${newSessionTitle}" started.` })
            router.push(`/group-buy/${sessionId}`)
        } catch (error) {
            toast.error("Error", { description: "Failed to create session." })
        } finally {
            setIsCreating(false)
            setIsCreateDialogOpen(false)
        }
    }

    const handleJoinByCode = async () => {
        if (!inviteCode.trim()) return

        setIsJoining(true)
        try {
            const sessionId = await getSessionIdByCode(inviteCode)
            if (sessionId) {
                toast.success("Session Found!", { description: "Redirecting to group buy session..." })
                router.push(`/group-buy/${sessionId}`)
            } else {
                toast.error("Invalid Code", { description: "Please check the code and try again." })
            }
        } catch (error) {
            toast.error("Error", { description: "Failed to verify code." })
        } finally {
            setIsJoining(false)
        }
    }

    if (!selectedVariant) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Product
                </Button>

                {/* Product Summary Header */}

                {/* Product Summary Header - Simplified as we rely on variant */}
                <div className="flex gap-4 items-center mb-8">
                    {/* Placeholder or Variant Info if available */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted border">
                        {/* Fallback image since we don't have product images in variant response yet */}
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                            🏷️
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            {selectedVariant?.name || "Group Buy Session"}
                        </h1>
                        <p className="text-muted-foreground">Start saving together!</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Option 1: Create New */}
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground">Start New Group Buy</h3>
                                        <p className="text-sm text-muted-foreground">Be the captain! Share your link and save max.</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Group Buy Session</DialogTitle>
                                <DialogDescription>
                                    Give your session a name to help friends allow identify it.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="session-title">Session Title</Label>
                                    <Input
                                        id="session-title"
                                        placeholder="e.g. Office Lunch, Gaming Squad"
                                        value={newSessionTitle}
                                        onChange={(e) => setNewSessionTitle(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateSession} disabled={isCreating || !newSessionTitle || !selectedVariantId}>
                                    {isCreating ? "Creating..." : "Create Session"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="relative flex items-center py-2">
                        <Separator className="flex-1" />
                        <span className="px-4 text-xs uppercase text-muted-foreground font-medium">Or Join Friend</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Option 2: Join via Code */}
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Have an Invite Code?</h3>
                                <p className="text-sm text-muted-foreground">Enter the code shared by your friend to join.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter Session Code (e.g. g7JekL0d)"
                                    className="pl-9"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    // Use onKeyDown to verify on Enter if needed
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode()}
                                />
                            </div>
                            <Button onClick={handleJoinByCode} disabled={isJoining || !inviteCode}>
                                {isJoining ? "Joining..." : "Join Session"}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
