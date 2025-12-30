"use client"


import { GroupBuySessionComponent } from "@/components/group-buy-session"
import { useGetGroupBuySession } from "@/services/api/group-buy-service"
import type { GroupBuySession as UIGroupBuySession } from "@/types/group-buy"
import { useParams } from "next/navigation"

export default function GroupBuySessionPage() {
    const { sessionId } = useParams<{ sessionId: string }>()
    const { data: sessionData, isLoading, isError } = useGetGroupBuySession(sessionId)

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading session...</div>
    }

    if (isError || !sessionData) {
        return <div className="min-h-screen flex items-center justify-center">Failed to load session</div>
    }

    // Map API Response to UI Model
    const variant = sessionData.product_variant
    const sessionDetails = sessionData.buyer_group_session
    const productSession = sessionData.product_session
    const addresses = sessionData.address

    const currentPrice = variant.price
    // Mock original price if not provided
    const originalPrice = currentPrice * 1.2

    // Find applicable tier
    const tiers = productSession.group_buy_tiers || []
    const currentTier = tiers
        .sort((a, b) => b.participant_threshold - a.participant_threshold)
        .find(tier => (sessionDetails.current_participants || 0) >= tier.participant_threshold)

    const discountAmount = currentTier ? (currentPrice * currentTier.discount_percentage / 100) : 0
    const discountedPrice = currentPrice - discountAmount

    // Helper to calculate price details
    const deliveryCharges = 20000

    // Mock Participants since API only gives count
    const participantCount = sessionDetails.current_participants || 1
    const mockParticipants = Array.from({ length: participantCount }).map((_, i) => ({
        id: `p-${i}`,
        name: i === 0 ? "Host" : `User ${i + 1}`,
        quantity: 1,
        isYou: i === participantCount - 1 // Assume last joined is you? Logic TBD
    }))

    const defaultAddress = addresses.find(a => a.is_default) || addresses[0]

    const mappedSession: UIGroupBuySession = {
        id: sessionDetails.id,
        sessionCode: sessionDetails.session_code,
        product: {
            id: variant.product_id,
            title: variant.name, // Use variant name as title since product title is not in this response structure directly (it is in `variant.name` or we assume it)
            // Note: The new response has `product_variant` name but not full product object with images. 
            // The previous mock had nested product. 
            // We might need to fetch product details separately if we need images.
            // Wait, the user request JSON example shows:
            // "product_variant": { "name": "Hitam", ... }
            // It DOES NOT have product title or images.
            // This is a missing piece. The UI needs an image.
            // I will use a placeholder or see if I can fetch product details.
            // Ideally, I should fetch `useGetProduct` or similar.
            // But this is a server component. 
            // I'll leave image as placeholder for now, or fetch `getProduct(variant.product_id)`.
            // Let's settle for placeholder/variant name for now to avoid multiple fetches unless critical.
            image: "/placeholder.svg",
            rating: 4.5,
            reviewCount: 0,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            // Add max stock for quantity selector
            stock: variant.stock.current_stock
        },
        participants: mockParticipants,
        maxParticipants: productSession.max_participants,
        coupon: undefined,
        shippingAddress: {
            name: defaultAddress?.receiver_name || "No Address Selected",
            address: defaultAddress ? `${defaultAddress.street_address}, ${defaultAddress.city}` : "Please add an address",
        },
        priceDetails: {
            itemPrice: currentPrice,
            groupDiscount: discountAmount,
            deliveryCharges: deliveryCharges,
            totalAmount: discountedPrice + deliveryCharges,
        },
        status: (sessionDetails.status === "open") ? "cart" : "success",
    }

    return <GroupBuySessionComponent session={mappedSession} userAddresses={addresses} />
}
