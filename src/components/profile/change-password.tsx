"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function ChangePassword() {
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleSave = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast("New passwords do not match.")
            return
        }

        if (formData.newPassword.length < 8) {
            toast("Password must be at least 8 characters long.")
            return
        }

        // Password change logic here
        toast("Your password has been successfully updated.")

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Change Password</h2>
            </div>

            <div className="space-y-6 max-w-md">
                {/* Current Password */}
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Password Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                    </ul>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Update Password
                    </Button>
                </div>
            </div>
        </div>
    )
}
