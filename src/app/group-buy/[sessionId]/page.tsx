
import { GroupBuySessionComponent } from "@/components/group-buy-session"
import { getGroupBuySession } from "@/services/api/group-buy-service"
import { getUserAddresses } from "@/services/api/address-service"
import type { GroupBuySession as UIGroupBuySession } from "@/types/group-buy"
import { cookies } from "next/headers"

export default async function GroupBuySessionPage({
    params,
}: {
    params: Promise<{ sessionId: string }>
}) {
    // 1. Await params (Next.js 15 requirement)
    const { sessionId } = await params

    // 2. Get auth token
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value

    // 3. Parallel Data Fetching
    const [sessionData, addressData] = await Promise.all([
        getGroupBuySession(sessionId, token),
        getUserAddresses(token || ""),
    ])

    // 4. Map API Response to UI Model
    const currentPrice = sessionData.product_variant.price
    const originalPrice = sessionData.product_variant.product?.product_images?.[0]?.product_id ?
        currentPrice * 1.2 : currentPrice // Mock original price logic if not in API

    // Find applicable tier
    const currentTier = sessionData.group_buy_tiers
        .sort((a, b) => b.participant_threshold - a.participant_threshold)
        .find(tier => (sessionData.current_participants || 0) >= tier.participant_threshold)
        || sessionData.group_buy_tiers[0] // fallback to first tier

    const discountAmount = currentTier ? (currentPrice * currentTier.discount_percentage / 100) : 0
    const discountedPrice = currentPrice - discountAmount

    // Helper to calculate price details
    const deliveryCharges = 20000 // Fixed for now, can come from API later

    // Map Participants (mocking 'isYou' logic mostly, but checking ID if available)
    // Since API doesn't fully return user details in participant list yet in `GroupBuySession` type 
    // we might need to rely on what's available or mock.
    // However, looking at `GroupBuySession` type in service:
    // It has `group_buy_tiers` but NO `participants` array in the interface definition!
    // The previous mock had it. I need to be careful here.
    // The service definition `GroupBuySession` has:
    // current_participants?: number; 
    // BUT NO ARRAY. 
    // Result: I must create a mock array or empty array for now to prevent crash.

    const mockParticipants = [
        { id: "1", name: "User " + (sessionData.current_participants || 1), quantity: 1, isYou: true }
    ]

    const defaultAddress = addressData.find(a => a.is_default) || addressData[0]

    const mappedSession: UIGroupBuySession = {
        id: sessionData.id,
        sessionCode: sessionData.session_code,
        product: {
            id: sessionData.product_variant.product?.id || "",
            title: sessionData.product_variant.product?.title || sessionData.product_variant.name,
            image: sessionData.product_variant.product?.product_images?.[0]?.image_url || "/placeholder.svg",
            rating: 4.5, // Mock
            reviewCount: 100, // Mock
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
        },
        participants: mockParticipants, // API limitation workaround
        maxParticipants: sessionData.max_participants,
        coupon: undefined, // No coupon in API response yet
        shippingAddress: {
            name: defaultAddress?.receiver_name || "No Address Selected",
            address: defaultAddress ? `${defaultAddress.street_address}, ${defaultAddress.city}, ${defaultAddress.province}` : "Please add an address",
        },
        priceDetails: {
            itemPrice: currentPrice,
            groupDiscount: discountAmount,
            deliveryCharges: deliveryCharges,
            totalAmount: discountedPrice + deliveryCharges,
        },
        status: (sessionData.status === "active") ? "cart" : "success", // Simple mapping
    }

    return <GroupBuySessionComponent session={mappedSession} />
}
