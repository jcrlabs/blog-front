import type { Metadata, Viewport } from "next"
import { Inter, Newsreader } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f0d0b",
}

export const metadata: Metadata = {
  title: "AI·feed — The AI Engineer Intelligence Feed",
  description: "Curated insights on LLMs, MCP, agents, RAG and AI architecture from Anthropic, OpenAI, Hugging Face and the best independent researchers.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "AI·feed", statusBarStyle: "black-translucent" },
  icons: { apple: "/apple-touch-icon.png", icon: "/icon-512.svg" },
  openGraph: {
    title: "AI·feed — The AI Engineer Intelligence Feed",
    description: "Curated insights on LLMs, MCP, agents, RAG and AI architecture.",
    type: "website",
  },
}

// Inline script to apply theme before first paint — prevents flash
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI·feed" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-dvh" style={{ fontFamily: "var(--font-inter), Inter, -apple-system, sans-serif" }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  )
}
