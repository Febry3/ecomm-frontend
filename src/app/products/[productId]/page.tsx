"use client"

import ProductCarousel from "@/components/products-carousel";
import { Button } from "@/components/ui/button";
import { products } from "@/dummy/data-dum-product";
import { Minus, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductPage() {
    const router = useRouter();
    const currentPath = usePathname();
    const productId = useParams().productId;
    const product = products.find((val) => val.id === productId);
    const [quantity, setQuantity] = useState(0);

    return (
        <div className=" px-12 mx-12 py-5">
            <div className="grid md:grid-cols-12 gap-5">
                <div className="md:col-span-5">
                    <ProductCarousel />
                </div>
                <div className="md:col-span-7 flex flex-col gap-5 py-5 px-5">
                    <h3 className="text-3xl font-bold line-clamp-1">{product?.title}</h3>
                    <div className="flex flex-row items-center gap-1">
                        <Star className="text-primary" width={18} height={18} />
                        <p>{`${product?.rating} (${product?.reviewCount})`}</p>
                    </div>
                    <p className="text-2xl font-semibold">Rp. {product?.price}</p>
                    <div className="flex flex-row items-center gap-3">
                        <button onClick={() => setQuantity((prev) => prev + 1)} className="hover:cursor-pointer hover:text-primary"><Plus size={20} /></button>
                        {quantity}
                        <button onClick={() => setQuantity((prev) => prev - 1)} className="hover:cursor-pointer hover:text-primary"><Minus size={20} /></button>
                        <p className="text-sm">Only {<span className="text-yellow-300">{product?.stock}</span>} items left. Don't missed out</p>
                    </div>
                    <div className="space-y-3 py-5">
                        <div className="flex gap-3">
                            <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                                Buy Now
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1 border-border/50 bg-transparent">
                                Add to Cart
                            </Button>
                        </div>
                        <Button size="lg" className="w-full bg-blue-500 hover:bg-primary/90 font-semibold" onClick={() => router.push(`/group-buy/123`)}>
                            Group Buy
                        </Button>

                    </div>
                    {/* Info Sections */}
                    <div className="space-y-4 pt-4">
                        {/* Group Buy Info */}
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-accent">👥</span>
                            </div>
                            <div>
                                <div className="font-semibold">What is Group Buy?</div>
                                <div className="text-sm text-muted-foreground">
                                    Learn about Our Group Buy here{" "}
                                    <a href="#" className="text-accent hover:underline">
                                        Details
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Policy */}
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-accent">🚚</span>
                            </div>
                            <div>
                                <div className="font-semibold">Delivery Policy</div>
                                <div className="text-sm text-muted-foreground">
                                    Learn about Our Delivery Policy here{" "}
                                    <a href="#" className="text-accent hover:underline">
                                        Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <h1 className="text-3xl font-bold">{`${product?.title} Full Spesifications and Details`}</h1>
                <div className="mt-5">
                    <h3 className="text-2xl font-semibold">Description</h3>
                    <p>{product?.description}</p>
                </div>
                <div className="mt-5">
                    <h3 className="text-2xl font-semibold">Specifications</h3>
                    <p>
                        Layout: 65% Compact <br />
                        Switch Type: Hot-swappable (kompatibel dengan switch mekanikal 3/5 pin) <br />
                        Keycap Material: Double-shot PBT <br />
                        Lighting: Full RGB Backlight dengan efek dinamis <br />
                        Connection: USB-C detachable cable <br />
                        Case Material: Aluminium alloy frame dengan finishing matte <br />
                        Knob Function: Volume & multimedia control <br />
                        Compatibility: Windows, macOS, dan Linux <br />
                        Anti-Ghosting: Full N-Key Rollover <br />
                    </p>
                </div>
                <div className="mt-5">
                    <h3 className="text-2xl font-semibold">Seller Notes</h3>
                    <p>
                        Barang 100% original dan bergaransi resmi. <br />
                        Dapat digunakan untuk gaming, coding, maupun pekerjaan profesional. <br />
                        Dilengkapi dengan kabel braided USB-C dan keycap puller. <br />
                        Stok terbatas — masuk kategori Group Buy untuk batch rilis awal. <br />
                        Warna dan efek RGB dapat disesuaikan menggunakan software bawaan MAXFIT Utility. <br />
                    </p>
                </div>
            </div>
        </div>
    )
}