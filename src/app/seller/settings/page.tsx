"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

export default function SettingsPage() {
    const [storeName, setStoreName] = useState("TechGaming Store")
    const [storeDescription, setStoreDescription] = useState(
        "Your trusted source for gaming peripherals and accessories.",
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Store Settings</h1>
                <p className="text-muted-foreground">Manage your store profile and business information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Store Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>TG</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeDescription">Store Description</Label>
                        <Textarea
                            id="storeDescription"
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessEmail">Business Email</Label>
                            <Input id="businessEmail" type="email" defaultValue="store@techgaming.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessPhone">Business Phone</Label>
                            <Input id="businessPhone" type="tel" defaultValue="+62 812-3456-7890" />
                        </div>
                    </div>

                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    )
}
