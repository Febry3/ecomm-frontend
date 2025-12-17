"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { CreateGroupBuyDialog } from "@/components/seller/create-group-buy-dialog"
import { useGetGroupBuySessions, GroupBuySession } from "@/services/api/group-buy-service"
import { useGetSellerProductsQuery } from "@/services/api/product-service"
import {
    Plus,
    Clock,
    Search,
    MoreVertical,
    Copy,
    Eye,
    XCircle,
    Users,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react"

export default function GroupBuyPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<GroupBuySession | null>(null)

    // Fetch real data from API
    const { data: sessions = [], isLoading, isError } = useGetGroupBuySessions()
    const { data: productsData } = useGetSellerProductsQuery()

    // Transform products for the create dialog
    const products = useMemo(() => {
        if (!productsData?.products) return []
        return productsData.products.map((product) => ({
            id: product.id,
            title: product.title,
            image: "/placeholder.svg", // No image field in the Product type
            variants: product.variants?.map((variant) => ({
                id: variant.id || "",
                name: variant.name,
                price: variant.price,
                stock: variant.stock?.current_stock || 0,
            })) || [],
        }))
    }, [productsData])

    const filteredSessions = (status: string) =>
        sessions.filter(
            (s) =>
                s.status === status &&
                (s.product_variant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.session_code.toLowerCase().includes(searchQuery.toLowerCase())),
        )

    const copyShareLink = (sessionCode: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/group-buy/${sessionCode}`)
        toast.success("Link Copied", {
            description: "Group buy link has been copied to clipboard.",
        })
    }

    const handleCancelSession = () => {
        toast.success("Session Cancelled", {
            description: "The group buy session has been cancelled.",
        })
        setCancelDialogOpen(false)
        setSelectedSession(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
            case "completed":
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>
            case "cancelled":
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const SessionCard = ({ session }: { session: GroupBuySession }) => {
        const currentParticipants = session.current_participants || 0
        const progress = (currentParticipants / session.max_participants) * 100
        const minReached = currentParticipants >= session.min_participants

        // Get the highest applicable discount from tiers
        const getMaxDiscount = () => {
            if (!session.group_buy_tiers?.length) return 0
            return Math.max(...session.group_buy_tiers.map(t => t.DiscountPercentage))
        }
        const discountPercentage = getMaxDiscount()
        const originalPrice = session.product_variant?.price || 0
        const discountedPrice = originalPrice * (1 - discountPercentage / 100)

        return (
            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                        <img
                            src="/placeholder.svg"
                            alt={session.product_variant?.name || "Product"}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-semibold text-base">{session.product_variant?.name || "Unknown Product"}</h3>
                                    <p className="text-xs text-muted-foreground">SKU: {session.product_variant?.sku}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">{session.session_code}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {getStatusBadge(session.status)}
                                    {session.status === "active" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => copyShareLink(session.session_code)}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Share Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-400"
                                                    onClick={() => {
                                                        setSelectedSession(session)
                                                        setCancelDialogOpen(true)
                                                    }}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Cancel Session
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        Participants
                                    </span>
                                    <span className="font-medium">
                                        {currentParticipants} / {session.max_participants}
                                        {minReached && <CheckCircle2 className="h-4 w-4 inline ml-1 text-green-500" />}
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className={minReached ? "text-green-500" : ""}>Min: {session.min_participants}</span>
                                    <span>Max: {session.max_participants}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Max Discount</p>
                                        <p className="text-sm font-bold text-green-500">{discountPercentage}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Original Price</p>
                                        <p className="text-sm font-bold text-accent">Rp {originalPrice.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {session.status === "active" ? (
                                        <span>Expires {new Date(session.expires_at).toLocaleDateString("id-ID")}</span>
                                    ) : (
                                        <span>Ended {new Date(session.expires_at).toLocaleDateString("id-ID")}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const activeCount = sessions.filter((s) => s.status === "active").length
    const completedCount = sessions.filter((s) => s.status === "completed").length
    const totalParticipants = sessions
        .filter((s) => s.status !== "cancelled")
        .reduce((acc, s) => acc + (s.current_participants || 0), 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Group Buy Sessions</h1>
                    <p className="text-muted-foreground">Create and manage group buying campaigns</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <Sparkles className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                                <p className="text-2xl font-bold">{activeCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <CheckCircle2 className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{completedCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/20">
                                <TrendingUp className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Participants</p>
                                <p className="text-2xl font-bold">{totalParticipants}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList className="bg-white/5">
                    <TabsTrigger value="active" className="data-[state=active]:bg-white/10">
                        Active ({filteredSessions("active").length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-white/10">
                        Completed ({filteredSessions("completed").length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-white/10">
                        Cancelled ({filteredSessions("cancelled").length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6">
                    {filteredSessions("active").length > 0 ? (
                        <div className="space-y-4">
                            {filteredSessions("active").map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Create a group buy session to start offering discounts to your customers.
                                </p>
                                <Button onClick={() => setCreateDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Session
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    {filteredSessions("completed").length > 0 ? (
                        <div className="space-y-4">
                            {filteredSessions("completed").map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No Completed Sessions</h3>
                                <p className="text-sm text-muted-foreground">Completed group buy sessions will appear here.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="cancelled" className="mt-6">
                    {filteredSessions("cancelled").length > 0 ? (
                        <div className="space-y-4">
                            {filteredSessions("cancelled").map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No Cancelled Sessions</h3>
                                <p className="text-sm text-muted-foreground">Cancelled group buy sessions will appear here.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Create Dialog */}
            <CreateGroupBuyDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} products={products} />

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent className="bg-background border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Group Buy Session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the group buy session for "{selectedSession?.product_variant?.name}". All{" "}
                            {selectedSession?.current_participants || 0} participants will be notified and refunded. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent">Keep Session</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelSession} className="bg-red-500 hover:bg-red-600">
                            Cancel Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
