"use client"

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
interface Product {
    id: string
    title: string
}

interface DeleteProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product
}

export function DeleteProductDialog({ open, onOpenChange, product }: DeleteProductDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            console.log("[v0] Deleting product:", product.id)

            toast.success(`Product "${product.title}" has been deleted`)

            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to delete product")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete <strong>{product.title}</strong> and all its variants, images, and stock
                        records. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Product"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
