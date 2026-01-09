export interface GroupBuyParticipant {
    id: string
    name: string
    avatar?: string
    quantity: number
    isYou?: boolean
    status?: string
}

export interface GroupBuySession {
    id: string
    sessionCode: string
    expiresAt: string
    product: {
        id: string
        title: string
        variantName?: string
        description?: string
        image: string
        rating: number
        reviewCount: number
        originalPrice: number
        discountedPrice: number
        stock?: number
    }
    participants: GroupBuyParticipant[]
    maxParticipants: number
    coupon?: {
        code: string
        discount: number
    }
    shippingAddress: {
        name: string
        address: string
    }
    priceDetails: {
        itemPrice: number
        groupDiscount: number
        deliveryCharges: number
        totalAmount: number
    }
    status: "cart" | "payment" | "success"
    isOrganizer?: boolean
    currentTierId?: string
}

export interface ChangeGroupBuySessionStatusRequest {
    session_id: string
    status: string
}
