import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LandingNavBar } from "@/components/layout/landing-nav"
import { Footer } from "@/components/layout/footer"
import { CartProvider } from "@/providers/cart-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jersey Store - Premium Sport Jerseys",
  description:
    "Discover authentic jerseys from your favorite teams and players. Quality guaranteed, passion delivered.",
  keywords: "jerseys, sports, NBA, NFL, MLB, soccer, basketball, football, authentic",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <LandingNavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
