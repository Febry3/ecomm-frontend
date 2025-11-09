import { ProductCard } from "@/components/product-card";
import { randomInt, randomUUID } from "crypto";

export const products: ProductCard[] = [
    {
        id: "1",
        title: "Wireless Logitech Mouse",
        description:
            "Mouse nirkabel ringan dengan sensor presisi untuk kerja dan gaming harian.",
        price: 1307350,
        rating: 4.7,
        reviewCount: 121,
        badge: "Group Buy",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 132,
    },
    {
        id: "2",
        title: "Mechanical Keyboard 75%",
        description:
            "Keyboard mekanik hot-swap dengan keycap PBT dan foam peredam suara.",
        price: 1549000,
        rating: 4.6,
        reviewCount: 289,
        badge: "Best Seller",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: true,
        stock: 123,
    },
    {
        id: "3",
        title: "Gaming Headset X Pro",
        description:
            "Suara surround 7.1 dengan mikrofon noise-cancelling untuk komunikasi jernih.",
        price: 999000,
        rating: 4.4,
        reviewCount: 87,
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 123,
    },
    {
        id: "4",
        title: "4K USB-C Webcam",
        description:
            "Webcam 4K dengan HDR dan auto-focus cepat, ideal untuk meeting & streaming.",
        price: 1750000,
        rating: 4.3,
        reviewCount: 64,
        badge: "New",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 123,
    },
    {
        id: "5",
        title: "Portable SSD 1TB",
        description:
            "SSD eksternal NVMe USB-C, baca/tulis super cepat untuk workflow kreatif.",
        price: 1699000,
        rating: 4.8,
        reviewCount: 442,
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: true,
        stock: 123,
    },
    {
        id: "6",
        title: "Bluetooth Speaker Mini",
        description:
            "Speaker ringkas dengan bass mantap dan baterai hingga 12 jam.",
        price: 549000,
        rating: 4.2,
        reviewCount: 310,
        badge: "Promo",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 123,
    },
    {
        id: "7",
        title: "27\" IPS Monitor 144Hz",
        description:
            "Panel IPS 144Hz dengan sRGB 99% dan bezel tipis untuk multitasking.",
        price: 3299000,
        rating: 4.5,
        reviewCount: 178,
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
        isFavorite: true,
        stock: 123,
    },
    {
        id: "8",
        title: "USB-C Multiport Hub",
        description:
            "Hub 7-in-1: HDMI 4K, 2x USB-A, USB-C PD, SD/MicroSD—cocok untuk laptop modern.",
        price: 459000,
        rating: 4.1,
        reviewCount: 95,
        image:
            "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 123,
    },
    {
        id: "9",
        title: "Streaming Microphone",
        description:
            "Mic kondensor USB dengan gain knob & monitoring tanpa latensi.",
        price: 899000,
        rating: 4.6,
        reviewCount: 203,
        badge: "Limited",
        image:
            "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1000&auto=format&fit=crop",
        isFavorite: false,
        stock: 123,
    },
    {
        id: "10",
        title: "Ergonomic Desk Chair",
        description:
            "Kursi kerja ergonomis dengan lumbar support dan material breathable mesh.",
        price: 2599000,
        rating: 4.3,
        reviewCount: 158,
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
        isFavorite: true,
        stock: 123,
    },
];
