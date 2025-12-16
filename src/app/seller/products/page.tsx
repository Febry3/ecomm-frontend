"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react"
import { DeleteProductDialog } from "@/components/seller/delete-product-dialog"
import { useGetSellerProducts } from "@/services/api/product-service"
import { Product } from "@/types/product"

function ProductTable({ searchQuery, onEdit, onDelete }: {
    searchQuery: string
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}) {
    const { data } = useGetSellerProducts()
    const products = data.products

    const filteredProducts = products?.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    return (
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
                {filteredProducts.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No products found
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.title}</TableCell>
                            <TableCell>{product.category_id || "-"}</TableCell>
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
                                        <DropdownMenuItem onClick={() => onEdit(product)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(product)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

function TableLoader() {
    return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )
}

export default function ProductsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const handleEdit = (product: Product) => {
        router.push(`/seller/products/edit/${product.id}`)
    }

    const handleDelete = (product: Product) => {
        setSelectedProduct(product)
        setDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-muted-foreground">Manage your product inventory</p>
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
                    <Suspense fallback={<TableLoader />}>
                        <ProductTable
                            searchQuery={searchQuery}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Suspense>
                </CardContent>
            </Card>

            {selectedProduct && (
                <DeleteProductDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} product={selectedProduct} />
            )}
        </div>
    )
}


