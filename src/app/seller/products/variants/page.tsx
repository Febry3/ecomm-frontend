"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, AlertTriangle } from "lucide-react"

const variants = [
    {
        id: "var-1",
        productTitle: "Gaming Keyboard RGB",
        name: "Standard",
        sku: "KB-001-STD",
        price: 467350,
        stock: 45,
    },
    {
        id: "var-2",
        productTitle: "Gaming Keyboard RGB",
        name: "Pro",
        sku: "KB-001-PRO",
        price: 567350,
        stock: 23,
    },
    {
        id: "var-3",
        productTitle: "Wireless Gaming Mouse",
        name: "Black",
        sku: "MS-002-BLK",
        price: 325000,
        stock: 3,
    },
    {
        id: "var-4",
        productTitle: "Wireless Gaming Mouse",
        name: "White",
        sku: "MS-002-WHT",
        price: 325000,
        stock: 0,
    },
]

export default function VariantsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterProduct, setFilterProduct] = useState("all")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Product Variants</h1>
                    <p className="text-muted-foreground">View and manage all product variants</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search variants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterProduct} onValueChange={setFilterProduct}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by product" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="kb">Gaming Keyboard RGB</SelectItem>
                                <SelectItem value="mouse">Wireless Gaming Mouse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {variants.map((variant) => (
                                <TableRow key={variant.id}>
                                    <TableCell className="font-medium">{variant.productTitle}</TableCell>
                                    <TableCell>{variant.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{variant.sku}</TableCell>
                                    <TableCell>Rp {variant.price.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {variant.stock === 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                            <span
                                                className={variant.stock === 0 ? "text-red-500" : variant.stock < 10 ? "text-orange-500" : ""}
                                            >
                                                {variant.stock}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
