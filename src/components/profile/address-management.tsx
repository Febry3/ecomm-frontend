"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"


interface Address {
    id: string
    label: string
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string
    city: string
    postalCode: string
    country: string
    isDefault: boolean
}

export function AddressManagement() {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "1",
            label: "Home",
            fullName: "John Doe",
            phone: "+1234567890",
            addressLine1: "123 Main Street",
            addressLine2: "Apt 4B",
            city: "New York",
            postalCode: "10001",
            country: "USA",
            isDefault: true,
        },
    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [formData, setFormData] = useState<Omit<Address, "id">>({
        label: "",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
        country: "",
        isDefault: false,
    })

    const handleAddAddress = () => {
        setEditingAddress(null)
        setFormData({
            label: "",
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            postalCode: "",
            country: "",
            isDefault: false,
        })
        setIsDialogOpen(true)
    }

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address)
        setFormData(address)
        setIsDialogOpen(true)
    }

    const handleSaveAddress = () => {
        if (editingAddress) {
            setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr)))
            toast("Your address has been updated successfully.")
        } else {
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString(),
            }
            setAddresses([...addresses, newAddress])
            toast("New address has been added successfully.")
        }
        setIsDialogOpen(false)
    }

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter((addr) => addr.id !== id))
        toast("Address has been removed.")
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manage Addresses</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddAddress} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Address Label</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g., Home, Office"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Input
                                    id="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="addressLine2">Address Line 2</Label>
                                <Input
                                    id="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                    placeholder="Apartment, suite, etc."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                        placeholder="Enter postal code"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="Enter country"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    Set as default address
                                </Label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveAddress}>Save Address</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {addresses.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No addresses yet. Add your first address.</p>
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div
                            key={address.id}
                            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold">{address.label}</h3>
                                        {address.isDefault && (
                                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm">{address.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {address.addressLine1}
                                        {address.addressLine2 && `, ${address.addressLine2}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.city}, {address.postalCode}, {address.country}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteAddress(address.id)}
                                        disabled={address.isDefault}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
