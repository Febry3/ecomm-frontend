"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react"
import { AddProductDialog } from "@/components/seller/add-product-dialog"
import { DeleteProductDialog } from "@/components/seller/delete-product-dialog"

const products = [
    {
        id: "1",
        title: "Gaming Keyboard RGB",
        slug: "gaming-keyboard-rgb",
        description: "Hotswap mechanical design Knob",
        sku: "KB-001",
        categoryId: "cat-1",
        category: "Keyboards",
        stock: 45,
        price: 467350,
        status: "approved" as const,
        isActive: true,
        badge: "Best Seller",
        images: [{ id: "img-1", url: "/gaming-keyboard-rgb.jpg", isPrimary: true }],
        variants: [{ id: "var-1", name: "Standard", sku: "KB-001-STD", price: 467350, stock: 45 }],
    },
    {
        id: "2",
        title: "Wireless Gaming Mouse",
        slug: "wireless-gaming-mouse",
        description: "High precision gaming mouse",
        sku: "MS-002",
        categoryId: "cat-2",
        category: "Mice",
        stock: 3,
        price: 325000,
        status: "approved" as const,
        isActive: true,
        images: [],
        variants: [],
    },
    {
        id: "3",
        title: "RGB Gaming Headset",
        slug: "rgb-gaming-headset",
        description: "Immersive sound quality",
        sku: "HS-003",
        categoryId: "cat-3",
        category: "Headsets",
        stock: 0,
        price: 589000,
        status: "pending" as const,
        isActive: false,
        images: [],
        variants: [],
    },
]

export default function ProductsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)

    const handleEdit = (product: (typeof products)[0]) => {
        router.push(`/seller/products/edit/${product.id}`)
    }

    const handleDelete = (product: (typeof products)[0]) => {
        setSelectedProduct(product)
        setDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.status === "approved"
                                                    ? "default"
                                                    : product.status === "pending"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
            {selectedProduct && (
                <DeleteProductDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} product={selectedProduct} />
            )}
        </div>
    )
}
