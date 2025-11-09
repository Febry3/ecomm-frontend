
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Urbanist } from 'next/font/google';
<<<<<<< HEAD
import ConditionalLayout from "@/components/conditional-layout"
=======
import TanstackProviders from "./tanstack-provider"
import { Toaster } from "sonner"
>>>>>>> 86d9ab27c938ab2ec0887fe61efa9e7acaf2e1ef

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
<<<<<<< HEAD
        <ConditionalLayout>{children}</ConditionalLayout>
=======
        <TanstackProviders>
          <ThemeProvider>{children}</ThemeProvider>
        </TanstackProviders>
        <Toaster/>
>>>>>>> 86d9ab27c938ab2ec0887fe61efa9e7acaf2e1ef
      </body>
    </html>
  )
}
