"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LocationPicker } from "@/components/map/location-picker"
import { toast } from "sonner"

interface Address {
    id: string
    label: string
    fullName: string
    phone: string
    streetAddress: string
    rt?: string
    rw?: string
    village: string
    district: string
    city: string
    province: string
    postalCode: string
    notes?: string
    isDefault: boolean
}

export function AddressManagement() {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "1",
            label: "Home",
            fullName: "John Doe",
            phone: "+6281234567890",
            streetAddress: "Jl. Merdeka No. 123",
            rt: "001",
            rw: "002",
            village: "Gambir",
            district: "Gambir",
            city: "Jakarta Pusat",
            province: "DKI Jakarta",
            postalCode: "10110",
            notes: "Near the monument",
            isDefault: true,
        },
    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [formData, setFormData] = useState<Omit<Address, "id">>({
        label: "",
        fullName: "",
        phone: "",
        streetAddress: "",
        rt: "",
        rw: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postalCode: "",
        notes: "",
        isDefault: false,
    })
    const [showMapPicker, setShowMapPicker] = useState(false)

    const handleLocationSelect = (addressData: any) => {
        setFormData({
            ...formData,
            streetAddress: addressData.streetAddress || "",
            village: addressData.village || "",
            district: addressData.district || "",
            city: addressData.city || "",
            province: addressData.province || "",
            postalCode: addressData.postalCode || "",
        })
        setShowMapPicker(false)
        toast.success("Address details have been filled from the map.")
    }

    const handleAddAddress = () => {
        setEditingAddress(null)
        setShowMapPicker(false)
        setFormData({
            label: "",
            fullName: "",
            phone: "",
            streetAddress: "",
            rt: "",
            rw: "",
            village: "",
            district: "",
            city: "",
            province: "",
            postalCode: "",
            notes: "",
            isDefault: false,
        })
        setIsDialogOpen(true)
    }

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address)
        setFormData(address)
        setShowMapPicker(false)
        setIsDialogOpen(true)
    }

    const handleSaveAddress = () => {
        if (editingAddress) {
            setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr)))
            toast.success("Your address has been updated successfully.")
        } else {
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString(),
            }
            setAddresses([...addresses, newAddress])
            toast.success("New address has been added successfully.")
        }
        setIsDialogOpen(false)
    }

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter((addr) => addr.id !== id))
        toast.success("Address has been removed.")
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
                            <DialogTitle>
                                {showMapPicker ? "Pick Location" : editingAddress ? "Edit Address" : "Add New Address"}
                            </DialogTitle>
                        </DialogHeader>

                        {showMapPicker ? (
                            <LocationPicker onCancel={() => setShowMapPicker(false)} onLocationSelect={handleLocationSelect} />
                        ) : (
                            <div className="space-y-4 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-primary border-primary/20 hover:bg-primary/5 bg-transparent"
                                        onClick={() => setShowMapPicker(true)}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Pick from Map
                                    </Button>
                                </div>

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
                                    <Label htmlFor="streetAddress">Street Address</Label>
                                    <Input
                                        id="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                        placeholder="Jalan Name, House Number"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rt">RT (Optional)</Label>
                                        <Input
                                            id="rt"
                                            value={formData.rt}
                                            onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                                            placeholder="000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rw">RW (Optional)</Label>
                                        <Input
                                            id="rw"
                                            value={formData.rw}
                                            onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                                            placeholder="000"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="village">Village (Kelurahan/Desa)</Label>
                                        <Input
                                            id="village"
                                            value={formData.village}
                                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                            placeholder="Enter village"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District (Kecamatan)</Label>
                                        <Input
                                            id="district"
                                            value={formData.district}
                                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                            placeholder="Enter district"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City/Regency</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Enter city"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="province">Province</Label>
                                        <Input
                                            id="province"
                                            value={formData.province}
                                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                            placeholder="Enter province"
                                        />
                                    </div>
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

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Patokan)</Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="e.g., White fence, near Indomaret"
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
                        )}
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
                                        {address.streetAddress}
                                        {address.rt && `, RT ${address.rt}`}
                                        {address.rw && `, RW ${address.rw}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.village}, {address.district}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.city}, {address.province} {address.postalCode}
                                    </p>
                                    {address.notes && <p className="text-sm text-muted-foreground italic mt-1">Note: {address.notes}</p>}
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
