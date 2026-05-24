"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

export function Hero({ postCount }: Props) {
  return (
    <header className="pt-8 pb-8 px-4 sm:px-6" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-3"
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
              style={{ background: "var(--accent)", flexShrink: 0 }}
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
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            The AI Engineer{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>Intelligence Feed</em>
          </h1>

          {/* Description */}
          <p
            className="text-sm leading-relaxed max-w-xl"
            style={{ color: "var(--text-2)" }}
          >
            Curated insights on LLMs, MCP, agents, RAG and AI architecture — from Anthropic,
            OpenAI, Hugging Face and the best independent researchers.
          </p>
        </motion.div>
      </div>
    </header>
  )
}
