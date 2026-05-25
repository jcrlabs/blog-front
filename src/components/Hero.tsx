"use client"

// Hero is now minimal — the sidebar carries feed stats on desktop.
// On mobile it renders a compact banner with live badge + tagline.
interface Props { postCount: number }

export function Hero({ postCount }: Props) {
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
          aria-label="Feed is live, updated every 6 hours"
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
            Live
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
          The AI Engineer{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Intelligence Feed</em>
        </h1>

        {postCount > 0 && (
          <>
            <span aria-hidden="true" style={{ color: "var(--border-2)", fontSize: 12 }}>·</span>
            <span
              aria-label={`${postCount.toLocaleString()} articles loaded`}
              style={{
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-3)",
              }}
            >
              {postCount.toLocaleString()} articles
            </span>
          </>
        )}
      </div>
    </header>
  )
}
