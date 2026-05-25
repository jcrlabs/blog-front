"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Props {
  postCount?: number
  lastUpdated?: string | null
}

export function Nav({ postCount, lastUpdated }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const t = (localStorage.getItem("theme") as "dark" | "light") || "dark"
    setTheme(t)
  }, [])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.setAttribute("data-theme", next)
  }

  function formatTicker(): string {
    const parts: string[] = []
    if (postCount && postCount > 0) parts.push(`${postCount} articles`)
    if (lastUpdated) {
      const d = new Date(lastUpdated)
      const hours = Math.floor((Date.now() - d.getTime()) / 3600000)
      if (hours < 1) parts.push("updated just now")
      else if (hours < 24) parts.push(`updated ${hours}h ago`)
      else parts.push(`updated ${Math.floor(hours / 24)}d ago`)
    } else {
      parts.push("updated every 6h")
    }
    return parts.join(" · ")
  }

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        height: 40,
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 12,
        }}
      >
        {/* Logo */}
        <Link href="/" aria-label="AI·feed — home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 3,
              height: 12,
              borderRadius: 2,
              background: "var(--accent)",
              flexShrink: 0,
              boxShadow: "0 0 6px rgba(232,74,46,0.5)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            AI
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ·feed
          </span>
        </Link>

        {/* Center ticker — desktop only */}
        <div
          className="nav-ticker"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "none",
            alignItems: "center",
            gap: 6,
          }}
          // show via media query handled in globals but inline for SSR safety
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 5px rgba(232,74,46,0.5)",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "var(--text-3)" }}>{formatTicker()}</span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          {/* RSS — desktop only */}
          <Link
            href="/rss.xml"
            aria-label="RSS feed"
            className="hidden lg:flex"
            style={{
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 4,
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--text-3)",
              textDecoration: "none",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-2)"
              el.style.background = "var(--bg-2)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-3)"
              el.style.background = "transparent"
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
            RSS
          </Link>

          {/* GitHub — desktop only */}
          <a
            href="https://github.com/jcrlabs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in new tab)"
            className="hidden lg:flex"
            style={{
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 4,
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--text-3)",
              textDecoration: "none",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-2)"
              el.style.background = "var(--bg-2)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-3)"
              el.style.background = "transparent"
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            jcrlabs
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              color: "var(--text-3)",
              cursor: "pointer",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-2)"
              el.style.background = "var(--bg-2)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = "var(--text-3)"
              el.style.background = "transparent"
            }}
          >
            {theme === "dark" ? (
              <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14A7 7 0 0012 5z"/>
              </svg>
            ) : (
              <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
