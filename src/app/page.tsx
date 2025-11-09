import { MainBanner } from "@/components/main-banner";
import ProductCard from "@/components/product-card";
import { dummyBannerSlides } from "@/dummy/data-dum-banner";
import { products } from "@/dummy/data-dum-product";
import apiClient from "@/lib/api-client";
import Link from "next/link";

export default function Home() {
  const onTest = async () => {
    const response = await apiClient.get("/test")
    console.log("test route", response)

  }
  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-50 font-sans dark:bg-black px-12 py-4">
      <MainBanner slides={dummyBannerSlides} />
      <div className="mt-10">
        <h1 className="text-4xl font-bold mb-5">Recommended For You !</h1>
        <div className="w-full bg-secondary rounded-2xl p-10 grid sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-10 gap-5 justify-center">
          {
            products.map((val) =>
              <Link className="sm:col-span-4 md:col-span-4 lg:col-span-2" href={`/product/${val.id}`} key={val.price}>
                <ProductCard id={val.id} title={val.title} description={val.description} price={val.price} rating={val.rating} reviewCount={val.reviewCount} image={val.image} isFavorite={false} />
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}
