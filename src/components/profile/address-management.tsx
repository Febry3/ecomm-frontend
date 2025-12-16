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
import { useAddUserAddress, useGetAllUserAddress, useUpdateUserAddress } from "@/services/api/address-service" // Assuming useUpdateUserAddress exists or will be used
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const addressSchema = z.object({
    address_label: z.string().min(1, "Address label is required"),
    receiver_name: z.string().min(1, "Receiver name is required"),
    street_address: z.string().min(5, "Street address must be at least 5 characters"),
    rt: z.string().optional(),
    rw: z.string().optional(),
    village: z.string().min(1, "Village is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postal_code: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
    notes: z.string().optional(),
    is_default: z.boolean(),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function AddressManagement() {
    const { data: userAddressData } = useGetAllUserAddress()
    const [addresses, setAddresses] = useState<Address[]>([])
    const { mutate: addUserAddress } = useAddUserAddress()
    // Assuming update mutation exists, if not I'll use the logic from before but cleaner
    // const { mutate: updateUserAddress } = useUpdateUserAddress() 

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [showMapPicker, setShowMapPicker] = useState(false)

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
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
        },
    })

    const { register, handleSubmit, setValue, reset, formState: { errors } } = form

    const handleLocationSelect = (addressData: any) => {
        setValue("street_address", addressData.streetAddress || "", { shouldValidate: true })
        setValue("village", addressData.village || "", { shouldValidate: true })
        setValue("district", addressData.district || "", { shouldValidate: true })
        setValue("city", addressData.city || "", { shouldValidate: true })
        setValue("province", addressData.province || "", { shouldValidate: true })
        setValue("postal_code", addressData.postalCode || "", { shouldValidate: true })

        setShowMapPicker(false)
        toast.success("Address details have been filled from the map.")
    }

    const handleAddAddress = () => {
        setEditingAddress(null)
        setShowMapPicker(false)
        reset({
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
        setShowMapPicker(false)
        reset({
            address_label: address.address_label,
            receiver_name: address.receiver_name,
            street_address: address.street_address,
            rt: address.rt || "",
            rw: address.rw || "",
            village: address.village,
            district: address.district,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
            notes: address.notes || "",
            is_default: address.is_default,
        })
        setIsDialogOpen(true)
    }

    const onSubmit = (data: AddressFormValues) => {
        if (editingAddress) {
            const updatedAddress = { ...editingAddress, ...data }
            setAddresses(addresses.map((addr) => (addr.address_id === editingAddress.address_id ? updatedAddress : addr)))
            toast.success("Your address has been updated successfully.")
        } else {
            addUserAddress(data as any)
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
            setAddresses(userAddressData)
        }
    }, [userAddressData])

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
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
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
                                        placeholder="e.g., Home, Office"
                                        {...register("address_label")}
                                    />
                                    {errors.address_label && (
                                        <p className="text-xs text-destructive">{errors.address_label.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="receiver_name">Receiver Name</Label>
                                    <Input
                                        id="receiver_name"
                                        placeholder="Enter receiver name"
                                        {...register("receiver_name")}
                                    />
                                    {errors.receiver_name && (
                                        <p className="text-xs text-destructive">{errors.receiver_name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="street_address">Street Address</Label>
                                    <Input
                                        id="street_address"
                                        placeholder="Jalan Name, House Number"
                                        {...register("street_address")}
                                    />
                                    {errors.street_address && (
                                        <p className="text-xs text-destructive">{errors.street_address.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rt">RT (Optional)</Label>
                                        <Input
                                            id="rt"
                                            placeholder="000"
                                            {...register("rt")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rw">RW (Optional)</Label>
                                        <Input
                                            id="rw"
                                            placeholder="000"
                                            {...register("rw")}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="village">Village (Kelurahan/Desa)</Label>
                                        <Input
                                            id="village"
                                            placeholder="Enter village"
                                            {...register("village")}
                                        />
                                        {errors.village && (
                                            <p className="text-xs text-destructive">{errors.village.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District (Kecamatan)</Label>
                                        <Input
                                            id="district"
                                            placeholder="Enter district"
                                            {...register("district")}
                                        />
                                        {errors.district && (
                                            <p className="text-xs text-destructive">{errors.district.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City/Regency</Label>
                                        <Input
                                            id="city"
                                            placeholder="Enter city"
                                            {...register("city")}
                                        />
                                        {errors.city && (
                                            <p className="text-xs text-destructive">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="province">Province</Label>
                                        <Input
                                            id="province"
                                            placeholder="Enter province"
                                            {...register("province")}
                                        />
                                        {errors.province && (
                                            <p className="text-xs text-destructive">{errors.province.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        placeholder="Enter postal code"
                                        {...register("postal_code")}
                                    />
                                    {errors.postal_code && (
                                        <p className="text-xs text-destructive">{errors.postal_code.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Patokan)</Label>
                                    <Input
                                        id="notes"
                                        placeholder="e.g., White fence, near Indomaret"
                                        {...register("notes")}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_default"
                                        className="w-4 h-4"
                                        {...register("is_default")}
                                    />
                                    <Label htmlFor="is_default" className="cursor-pointer">
                                        Set as default address
                                    </Label>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Address</Button>
                                </div>
                            </form>
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
