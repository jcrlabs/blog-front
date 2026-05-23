import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#02040a",
}

export const metadata: Metadata = {
  title: "AI·feed — The AI Engineer Intelligence Feed",
  description: "Curated insights on LLMs, MCP, agents, RAG and AI architecture from Anthropic, OpenAI, Hugging Face and the best independent researchers.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AI·feed",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/icon-512.svg",
  },
  openGraph: {
    title: "AI·feed — The AI Engineer Intelligence Feed",
    description: "Curated insights on LLMs, MCP, agents, RAG and AI architecture.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI·feed" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen font-sans" style={{ fontFamily: "var(--font-inter), Inter, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
