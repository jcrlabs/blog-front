"use client"

import type { FeedStats } from "@/lib/types"
import { formatRelative } from "./Sidebar"

// Compact banner: what this site is, how fresh it is and how much it holds.
interface Props { stats: FeedStats | null }

export function Hero({ stats }: Props) {
  const postCount = stats?.total ?? 0
  return (
    <header
      aria-label="Feed headline"
      style={{
        padding: "14px 20px 12px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Live badge */}
        <div
          role="status"
          aria-label="Feed refreshes every hour"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              flexShrink: 0,
              boxShadow: "0 0 6px rgba(232,74,46,0.55)",
            }}
            className="animate-pulse"
          />
          <span
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            {stats?.updatedAt ? `Updated ${formatRelative(stats.updatedAt)}` : "Hourly"}
          </span>
        </div>

        <span aria-hidden="true" style={{ color: "var(--border-2)", fontSize: 12 }}>·</span>

        <h1
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          AI engineering news,{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>from the source</em>
        </h1>

        {postCount > 0 && (
          <>
            <span aria-hidden="true" style={{ color: "var(--border-2)", fontSize: 12 }}>·</span>
            <span
              aria-label={`${postCount.toLocaleString()} articles from the last 14 days`}
              style={{
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-3)",
              }}
            >
              {postCount.toLocaleString()} articles · last 14 days
            </span>
          </>
        )}
      </div>
    </header>
  )
}
