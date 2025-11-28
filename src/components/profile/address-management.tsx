"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LocationPicker } from "@/components/map/location-picker"
import { toast } from "sonner"
import { Address } from "@/types/address"
import { useAddUserAddress, useGetAllUserAddress } from "@/services/api/address-service"

export function AddressManagement() {
    const { data: userAddressData } = useGetAllUserAddress()
    const [addresses, setAddresses] = useState<Address[]>([]);
    const { mutate: addUserAddress } = useAddUserAddress();

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [formData, setFormData] = useState<Omit<Address, "address_id" | "user_id" | "created_at" | "updated_at">>({
        address_label: "",
        receiver_name: "",
        street_address: "",
        rt: "",
        rw: "",
        village: "",
        district: "",
        city: "",
        province: "",
        postal_code: "",
        notes: "",
        is_default: false,
    })
    const [showMapPicker, setShowMapPicker] = useState(false)

    const handleLocationSelect = (addressData: any) => {
        setFormData({
            ...formData,
            street_address: addressData.streetAddress || "",
            village: addressData.village || "",
            district: addressData.district || "",
            city: addressData.city || "",
            province: addressData.province || "",
            postal_code: addressData.postalCode || "",
        })
        setShowMapPicker(false)
        toast.success("Address details have been filled from the map.")
    }

    const handleAddAddress = () => {
        setEditingAddress(null)
        setShowMapPicker(false)
        setFormData({
            address_label: "",
            receiver_name: "",
            street_address: "",
            rt: "",
            rw: "",
            village: "",
            district: "",
            city: "",
            province: "",
            postal_code: "",
            notes: "",
            is_default: false,
        })
        setIsDialogOpen(true)
    }

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address)
        const { address_id, user_id, created_at, updated_at, ...rest } = address
        setFormData(rest)
        setShowMapPicker(false)
        setIsDialogOpen(true)
    }

    const handleSaveAddress = () => {
        if (editingAddress) {
            setAddresses(addresses.map((addr) => (addr.address_id === editingAddress.address_id ? { ...addr, ...formData } : addr)))
            toast.success("Your address has been updated successfully.")
        } else {
            addUserAddress(formData);
            toast.success("New address has been added successfully.")
        }
        setIsDialogOpen(false)
    }

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter((addr) => addr.address_id !== id))
        toast.success("Address has been removed.")
    }

    useEffect(() => {
        if (userAddressData) {
            setAddresses(userAddressData);
        }
    }, [userAddressData]);

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
                                    <Label htmlFor="address_label">Address Label</Label>
                                    <Input
                                        id="address_label"
                                        value={formData.address_label}
                                        onChange={(e) => setFormData({ ...formData, address_label: e.target.value })}
                                        placeholder="e.g., Home, Office"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="receiver_name">Receiver Name</Label>
                                    <Input
                                        id="receiver_name"
                                        value={formData.receiver_name}
                                        onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                                        placeholder="Enter receiver name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="street_address">Street Address</Label>
                                    <Input
                                        id="street_address"
                                        value={formData.street_address}
                                        onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
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
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
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
                                        id="is_default"
                                        checked={formData.is_default}
                                        onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="is_default" className="cursor-pointer">
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
                            key={address.address_id}
                            className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold">{address.address_label}</h3>
                                        {address.is_default && (
                                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm">{address.receiver_name}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {address.street_address}
                                        {address.rt && `, RT ${address.rt}`}
                                        {address.rw && `, RW ${address.rw}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.village}, {address.district}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.city}, {address.province} {address.postal_code}
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
                                        onClick={() => handleDeleteAddress(address.address_id)}
                                        disabled={address.is_default}
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
