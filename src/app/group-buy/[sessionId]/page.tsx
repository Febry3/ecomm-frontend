import { GroupBuySessionComponent } from "@/components/group-buy-session"
import type { GroupBuySession } from "@/types/group-buy"

// Mock data for demonstration
const mockSession: GroupBuySession = {
    id: "1",
    sessionCode: "g7JekL0d",
    product: {
        id: "1",
        title: "Keyboard Gaming Fantech MAXFIT",
        image: "/gaming-keyboard-rgb.jpg",
        rating: 4.5,
        reviewCount: 30,
        originalPrice: 467350,
        discountedPrice: 427350,
    },
    participants: [
        { id: "1", name: "Rayan Astolfo", quantity: 1, isYou: true },
        { id: "2", name: "Alfathaba", quantity: 1 },
        { id: "3", name: "Febry T", quantity: 1 },
        { id: "4", name: "Hafid Alaniyar", quantity: 1 },
        { id: "5", name: "Gina Soraya", quantity: 1 },
    ],
    maxParticipants: 10,
    coupon: {
        code: "LOOTBOX1111",
        discount: 20000,
    },
    shippingAddress: {
        name: "Rino Setiawan Pusat, Jaya Timur Jaya, Bevan, Kamar No. 15, Lt 21",
        address:
            "Sukabumi No.18, RT.9/RW.10/06, Kebayoran Cilandak, Kecamatan Ciayumajakuning, Kota Bandung Utara, (Kost Rumahan) (Dekat Jalan Raya Raihan) (Halaman 1600), DKI Jaya)",
    },
    priceDetails: {
        itemPrice: 427350,
        groupDiscount: 20000,
        deliveryCharges: 20000,
        totalAmount: 427350,
    },
    status: "cart",
}

export default function GroupBuySessionPage({
    params,
}: {
    params: { sessionId: string }
}) {
    return <GroupBuySessionComponent session={mockSession} />
}
