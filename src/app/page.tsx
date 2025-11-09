"use client"

import { MainBanner } from "@/components/main-banner";
import { Button } from "@/components/ui/button";
import { dummyBannerSlides } from "@/dummy/data-dum-banner";
import apiClient from "@/lib/api-client";
import Image from "next/image";

export default function Home() {
  const onTest = async () => {
    const response = await apiClient.get("/test")
    console.log("test route", response)

  }
  return (
    <div className="flex min-h-screen w-full justify-center bg-zinc-50 font-sans dark:bg-black px-10 py-4">
      <MainBanner slides={dummyBannerSlides} />
    </div>
  );
}
