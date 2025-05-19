import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { EnvStatus } from "@/components/env-status"
import { AuthErrorHandler } from "@/components/auth-error-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LORI - Fashion Store",
  description: "Premium fashion and clothing store",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <AuthErrorHandler />
              {children}
              <EnvStatus />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
