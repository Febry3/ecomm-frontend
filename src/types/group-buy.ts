export interface GroupBuyParticipant {
    id: string
    name: string
    avatar?: string
    quantity: number
    isYou?: boolean
}

export interface GroupBuySession {
    id: string
    sessionCode: string
    product: {
        id: string
        title: string
        image: string
        rating: number
        reviewCount: number
        originalPrice: number
        discountedPrice: number
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
}

export interface ChangeGroupBuySessionStatusRequest {
    session_id: string
    status: string
}
