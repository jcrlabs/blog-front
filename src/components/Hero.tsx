"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

export function Hero({ postCount }: Props) {
  return (
    <header
      className="pt-10 pb-10 px-4 sm:px-6 relative overflow-hidden"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Depth gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 40%, rgba(232,74,46,0.06) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 80% at 90% 10%, rgba(232,74,46,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          {/* Live badge */}
          <div
            role="status"
            aria-label="Feed updated every 6 hours"
            className="flex items-center gap-2"
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-3)",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent)", flexShrink: 0, boxShadow: "0 0 6px rgba(232,74,46,0.5)" }}
            />
            <span style={{ color: "var(--accent)" }}>Live</span>
            <span aria-hidden="true">·</span>
            <span>Updated every 6h</span>
            {postCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className="tabular-nums"
                  aria-label={`${postCount.toLocaleString()} articles available`}
                >
                  {postCount.toLocaleString()} articles
                </span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1
            className="leading-[1.15] tracking-tight"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.025em",
              maxWidth: "28ch",
            }}
          >
            The AI Engineer{" "}
            <em
              className="not-italic"
              style={{
                color: "var(--accent)",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              Intelligence Feed
            </em>
          </h1>

          {/* Description */}
          <p
            className="text-sm leading-relaxed max-w-xl"
            style={{ color: "var(--text-2)", letterSpacing: "0.005em" }}
          >
            Curated insights on LLMs, MCP, agents, RAG and AI architecture — from Anthropic,
            OpenAI, Hugging Face and the best independent researchers.
          </p>
        </motion.div>
      </div>
    </header>
  )
}
