"use client"

import { GroupBuySessionComponent } from "@/components/group-buy-session"
import { useGetGroupBuySession } from "@/services/api/group-buy-service"
import { useAuthStore } from "@/stores/auth-store"
import type { GroupBuySession as UIGroupBuySession } from "@/types/group-buy"
import { useParams } from "next/navigation"

export default function GroupBuySessionPage() {
    const { sessionId } = useParams<{ sessionId: string }>()
    const { data: sessionData, isLoading, isError } = useGetGroupBuySession(sessionId)
    const { user } = useAuthStore()

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
    // Use current price as base
    const originalPrice = currentPrice

    // Find applicable tier
    const tiers = productSession.group_buy_tiers || []
    const currentParticipantCount = sessionDetails.current_participants || 0

    // Sort tiers by threshold descending to check highest first
    const sortedTiers = [...tiers].sort((a, b) => b.participant_threshold - a.participant_threshold)

    // Find the active tier based on current participants
    const currentTier = sortedTiers.find(tier => currentParticipantCount >= tier.participant_threshold)

    // Calculate discount
    const discountPercentage = currentTier ? currentTier.discount_percentage : 0
    const discountAmount = currentPrice * (discountPercentage / 100)
    const discountedPrice = currentPrice - discountAmount

    // Helper to calculate price details
    const deliveryCharges = 20000

    // Map Participants from API to UI Model
    const members = sessionDetails.members || []

    // Map member data to participant interface
    const participants = members.map((member) => ({
        id: member.id,
        name: member.user.username,
        quantity: member.quantity,
        isYou: user ? member.user_id === user.user_id : false,
        avatar: member.user.profile_url
    }))

    const defaultAddress = addresses.find(a => a.is_default) || addresses[0]

    const userIsParticipant = participants.some(p => p.isYou)

    const mappedSession: UIGroupBuySession = {
        id: sessionDetails.id,
        sessionCode: sessionDetails.session_code,
        product: {
            id: variant.product_id,
            title: variant.name,
            // Fallback image as API response excludes product images
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
            rating: 4.5,
            reviewCount: 0,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            stock: variant.stock.current_stock
        },
        participants: participants,
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
        status: userIsParticipant ? "success" : (sessionDetails.status === "open" ? "cart" : "success"),
    }

    return <GroupBuySessionComponent session={mappedSession} userAddresses={addresses} />
}
