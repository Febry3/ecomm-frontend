import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Urbanist } from 'next/font/google';
import TanstackProviders from "./tanstack-provider"
import { Toaster } from "sonner"

const _urbanist = Urbanist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-commerce",
  description: "Created to fulfill startup course",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={_urbanist.className}>
        <TanstackProviders>
          <ThemeProvider>{children}</ThemeProvider>
        </TanstackProviders>
        <Toaster/>
      </body>
    </html>
  )
}
