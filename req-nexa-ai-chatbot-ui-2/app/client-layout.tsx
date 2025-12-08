"use client"

import type React from "react"

import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme-context"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <style jsx global>{`
        :root {
          --font-sans: ${geist.style.fontFamily};
          --font-mono: ${geistMono.style.fontFamily};
        }
      `}</style>
      {children}
      <Analytics />
    </ThemeProvider>
  )
}
