import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image"
import { Button } from "./ui/button";

export interface ProductCard {
    id: string,
    title: string,
    description: string,
    price: number,
    rating: number,
    reviewCount: number,
    badge?: string,
    image: string,
    isFavorite: boolean,
}

type ProductProps = ProductCard & React.HTMLAttributes<HTMLDivElement>;

export default function ProductCard({
    className,
    title,
    description,
    price,
    rating,
    reviewCount,
    badge,
    image,
    isFavorite,
    ...divProps
}: ProductProps) {
    return (
        <div {...divProps} className={cn("rounded-xl flex flex-col gap-3 max-h-140 my-3 hover:cursor-pointer", className)}>
            <div className="relative w-full aspect-square max-h-[70%]">
                <Image
                    src={image}
                    alt={description}
                    fill
                    className="rounded-xl object-fit"
                    sizes="(min-width: 768px) 300px, 100vw"
                    priority={false}
                />
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>
                <p className="text-sm line-clamp-2">{description}</p>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-1">
                        <Star className="text-primary" width={18} height={18} />
                        <p>{`${rating} (${reviewCount})`}</p>
                    </div>
                    <p>Rp. {price}</p>
                </div>
                <Button type="button" className="w-[50%]">Add to Cart</Button>
            </div>
        </div >
    );
}