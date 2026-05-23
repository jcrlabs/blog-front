"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 safe-top transition-all duration-300"
      style={{
        background: scrolled ? "rgba(245,243,238,0.95)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" aria-label="AI·feed — home" className="group flex items-center gap-2">
          <span
            aria-hidden="true"
            className="text-xs font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{ background: "var(--accent)", color: "#fff", letterSpacing: "0.12em" }}
          >
            AI
          </span>
          <span
            className="font-bold text-[15px] tracking-tight transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            feed
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/rss.xml"
            aria-label="Subscribe via RSS feed"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg min-h-[38px] transition-colors hover:bg-[var(--bg-2)]"
            style={{ color: "var(--text-3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
            RSS
          </Link>
          <a
            href="https://github.com/jcrlabs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="jcrlabs on GitHub (opens in new tab)"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg min-h-[38px] transition-colors hover:bg-[var(--bg-2)]"
            style={{ color: "var(--text-3)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            jcrlabs
          </a>
        </div>
      </div>
    </nav>
  )
}
