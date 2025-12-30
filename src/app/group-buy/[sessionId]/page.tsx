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

    const variant = sessionData.product_variant
    const sessionDetails = sessionData.buyer_group_session
    const productSession = sessionData.product_session
    const addresses = sessionData.address
    const currentPrice = variant.price
    const originalPrice = currentPrice
    const tiers = productSession.group_buy_tiers || []
    const currentParticipantCount = sessionDetails.current_participants || 0
    const sortedTiers = [...tiers].sort((a, b) => b.participant_threshold - a.participant_threshold)
    const currentTier = sortedTiers.find(tier => currentParticipantCount >= tier.participant_threshold)
    const discountPercentage = currentTier ? currentTier.discount_percentage : 0
    const discountAmount = currentPrice * (discountPercentage / 100)
    const discountedPrice = currentPrice - discountAmount
    const deliveryCharges = 20000
    const members = sessionDetails.members || []

    if (user) {
        console.log("[Page] Current User ID:", user.user_id, typeof user.user_id)
        console.log("[Page] User Object Keys:", Object.keys(user))
    }

    const participants = members.map((member) => {
        // Handle potential ID mismatch (user_id vs id)
        const currentUserId = user ? (user.user_id || (user as any).id) : null

        const isYou = currentUserId ? String(member.user_id) === String(currentUserId) : false

        if (isYou) console.log("[Page] Found 'You' in participants:", member.user.username)
        if (!isYou && user) console.log(`[Page] Mismatch: Member ${member.user_id} vs User ${currentUserId}`)

        return {
            id: member.id,
            name: member.user.username,
            quantity: member.quantity,
            isYou: isYou,
            avatar: member.user.profile_url,
            status: member.status
        }
    })

    const defaultAddress = addresses.find(a => a.is_default) || addresses[0]

    const userIsParticipant = participants.some(p => p.isYou)

    // Determine status based on "isYou" participant's status
    let pageStatus: "cart" | "payment" | "success" = "cart"

    if (userIsParticipant) {
        const myParticipant = participants.find(p => p.isYou)
        // Adjust these values based on actual API enum
        if (myParticipant?.status === "paid" || myParticipant?.status === "completed") {
            pageStatus = "success"
        } else if (myParticipant?.status === "waiting_payment") {
            pageStatus = "cart"
        } else {
            // Default fallback if just joined but unknown status (e.g. pending)
            pageStatus = "cart"
        }
    } else if (sessionDetails.status !== "open") {
        pageStatus = "success" // Or some read-only state
    }

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
        status: pageStatus,
        isOrganizer: user ? String(sessionDetails.organizer_user_id) === String(user.user_id || (user as any).id) : false,
    }

    return <GroupBuySessionComponent session={mappedSession} userAddresses={addresses} />
}
