"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

const ease = [0.16, 1, 0.3, 1] as const

export function Hero({ postCount }: Props) {
  return (
    <header className="pt-12 pb-10 px-4 sm:px-6" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col gap-4"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div
              role="status"
              aria-label="Feed updated every 6 hours"
              className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--accent)" }}
            >
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent)" }}
              />
              Live
            </div>
            <span aria-hidden="true" style={{ color: "var(--border-2)" }}>·</span>
            <span className="text-[11px] tracking-widest uppercase font-medium" style={{ color: "var(--text-3)" }}>
              Updated every 6h
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              color: "var(--text)",
              letterSpacing: "-0.03em",
            }}
          >
            The AI Engineer<br />
            <em className="not-italic" style={{ color: "var(--accent)" }}>Intelligence Feed</em>
          </h1>

          {/* Description */}
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: "var(--text-2)" }}
          >
            Curated insights on LLMs, MCP, agents, RAG and AI architecture — from Anthropic,
            OpenAI, Hugging Face and the best independent researchers.
            {postCount > 0 && (
              <span
                className="ml-2 tabular-nums text-sm"
                style={{ color: "var(--text-3)" }}
                aria-label={`${postCount.toLocaleString()} articles available`}
              >
                {postCount.toLocaleString()} articles.
              </span>
            )}
          </p>
        </motion.div>
      </div>
    </header>
  )
}
