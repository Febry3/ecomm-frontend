
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Urbanist } from 'next/font/google';
import ConditionalLayout from "@/components/conditional-layout"
import { GoogleOAuthProvider } from "@react-oauth/google"

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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
