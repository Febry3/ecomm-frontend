"use client"

import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import Image from "next/image";

export default function Home() {
  const onTest = async () => {
    const response = await apiClient.get("/test")
    console.log("test route", response)

  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button type="button" onClick={onTest}>Click Me</Button>
    </div>
  );
}
