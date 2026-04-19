import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#050507",
}

export const metadata: Metadata = {
  title: "JCRLabs Tech Blog",
  description: "Kubernetes, DevOps, Cloud Native — curated and original content from the trenches",
  appleWebApp: {
    capable: true,
    title: "JCRLabs",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icon-192.svg",
  },
  openGraph: {
    title: "JCRLabs Tech Blog",
    description: "Kubernetes, DevOps, Cloud Native content",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="min-h-screen grid-bg">
        {children}
      </body>
    </html>
  )
}
