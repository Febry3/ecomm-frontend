"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock } from "lucide-react"

const sessions = [
    {
        id: "GB-001",
        product: "Gaming Keyboard RGB",
        discount: 20,
        minParticipants: 5,
        maxParticipants: 20,
        currentParticipants: 12,
        expiresAt: "2024-02-15",
        status: "active",
    },
    {
        id: "GB-002",
        product: "Wireless Gaming Mouse",
        discount: 15,
        minParticipants: 3,
        maxParticipants: 10,
        currentParticipants: 10,
        expiresAt: "2024-02-10",
        status: "completed",
    },
]

export default function GroupBuyPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Group Buy Sessions</h1>
                    <p className="text-muted-foreground">Create and manage group buying campaigns</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                    <Card key={session.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{session.product}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{session.id}</p>
                                </div>
                                <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Participants</span>
                                    <span className="font-medium">
                                        {session.currentParticipants} / {session.maxParticipants}
                                    </span>
                                </div>
                                <Progress value={(session.currentParticipants / session.maxParticipants) * 100} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Discount</p>
                                    <p className="text-lg font-bold text-green-500">{session.discount}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Min. Required</p>
                                    <p className="text-lg font-bold">{session.minParticipants}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Expires on {session.expiresAt}
                            </div>

                            <Button variant="outline" className="w-full bg-transparent">
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
