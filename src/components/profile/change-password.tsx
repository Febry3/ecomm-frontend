"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, Save, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function ChangePassword() {
    const [activeTab, setActiveTab] = useState<"change" | "forgot">("change")
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

    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: "",
        otp: "",
    })
    const [otpSent, setOtpSent] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleSave = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match.")
            return
        }

        if (formData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.")
            return
        }

        // Password change logic here
        toast.success("Your password has been successfully updated.")

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const handleSendOTP = () => {
        if (!forgotPasswordData.email) {
            toast.error("Please enter your email address.")
            return
        }

        // Send OTP logic here
        setOtpSent(true)
        setCountdown(60) // 60 seconds countdown
        toast.error("Please check your email for the OTP code.")
    }

    const handleVerifyOTP = () => {
        if (!forgotPasswordData.otp) {
            toast.error("Please enter the OTP code.")
            return
        }

        // Verify OTP logic here
        toast.success("You can now reset your password.")
    }

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Security</h2>
            </div>

            <div className="flex gap-1 mb-6 border-b border-border">
                <button
                    onClick={() => setActiveTab("change")}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === "change"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Change Password
                    {activeTab === "change" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("forgot")}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === "forgot"
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Forgot Password
                    {activeTab === "forgot" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {activeTab === "change" && (
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
            )}

            {activeTab === "forgot" && (
                <div className="space-y-6 max-w-md">
                    <p className="text-sm text-muted-foreground">
                        Enter your email address and we'll send you an OTP code to reset your password.
                    </p>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="forgotEmail">Email Address</Label>
                        <Input
                            id="forgotEmail"
                            type="email"
                            value={forgotPasswordData.email}
                            onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                            placeholder="Enter your email"
                            disabled={otpSent}
                        />
                    </div>

                    {/* Send OTP Button */}
                    {!otpSent && (
                        <Button onClick={handleSendOTP} className="w-full gap-2">
                            <Mail className="w-4 h-4" />
                            Send OTP via Email
                        </Button>
                    )}

                    {/* Countdown Timer */}
                    {otpSent && countdown > 0 && (
                        <div className="bg-accent/20 border border-accent rounded-lg p-4 text-center">
                            <p className="text-sm font-medium text-accent">
                                OTP sent! You can request a new code in {countdown} seconds
                            </p>
                        </div>
                    )}

                    {/* Resend OTP Button */}
                    {otpSent && countdown === 0 && (
                        <Button onClick={handleSendOTP} variant="outline" className="w-full gap-2">
                            <Mail className="w-4 h-4" />
                            Resend OTP
                        </Button>
                    )}

                    {/* OTP Input Field */}
                    {otpSent && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="otpCode">Enter OTP Code</Label>
                                <Input
                                    id="otpCode"
                                    type="text"
                                    value={forgotPasswordData.otp}
                                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, otp: e.target.value })}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="text-center text-2xl tracking-widest"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Please check your email for the OTP code
                                </p>
                            </div>

                            <Button onClick={handleVerifyOTP} className="w-full gap-2">
                                Verify OTP
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
