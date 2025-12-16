export type ProductVariantStock = {
    current_stock: number
    reserved_stock: number
    low_stock_threshold: number
}

export type ProductVariant = {
    id?: string
    product_id?: string
    name: string
    sku: string
    price: number
    is_active: boolean
    stock: ProductVariantStock
}


export type ProductRequest = {
    title: string
    slug: string
    description: string
    badge?: string
    category_id?: string
    is_active: boolean
    variants?: ProductVariant[]
}