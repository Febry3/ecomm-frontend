export interface ProductVariantStock {
    product_variant_id?: string
    current_stock: number
    reserved_stock: number
    low_stock_threshold: number
    last_updated?: string
}

export interface ProductVariant {
    id?: string
    product_id?: string
    sku: string
    name: string
    price: number
    is_active: boolean
    created_at?: string
    updated_at?: string
    stock: ProductVariantStock
}

export interface ProductImage {
    id: string
    product_id: string
    image_url: string
    created_at: string
}

export interface Product {
    id: string
    seller_id: number
    title: string
    slug: string
    description: string
    category_id: string
    badge: string
    is_active: boolean
    status: string
    created_at: string
    updated_at: string
    variants: ProductVariant[]
    product_images?: ProductImage[]
}

export interface SellerProductsResponse {
    count_variant: number
    products: Product[]
    total_inventory_value: number
    total_stock: number
    total_stock_alert: number
}

export type ProductRequest = {
    title: string
    slug: string
    description: string
    badge?: string
    category_id?: number
    is_active: boolean
    variants?: ProductVariant[]
}