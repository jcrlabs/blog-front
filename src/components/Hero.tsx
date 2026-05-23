"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

const ease = [0.16, 1, 0.3, 1] as const

export function Hero({ postCount }: Props) {
  return (
    <header className="pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div
            role="status"
            aria-label="Feed status: live, updated every 6 hours"
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{
              border: "1px solid rgba(99,102,241,0.25)",
              background: "rgba(99,102,241,0.08)",
              color: "var(--accent)",
            }}
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent)" }}
            />
            Live · Updated every 6h
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07, ease }}
        >
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-3"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            <span style={{ color: "var(--text)" }}>The AI Engineer </span>
            <span className="gradient-text">Intelligence Feed</span>
          </h1>
        </motion.div>

        {/* Description + count */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14, ease }}
          className="text-sm sm:text-base leading-relaxed max-w-2xl"
          style={{ color: "var(--text-2)" }}
        >
          Curated insights on LLMs, MCP, agents, RAG and AI architecture — from Anthropic,
          OpenAI, Hugging Face and the best independent researchers.
          {postCount > 0 && (
            <span
              aria-label={`${postCount.toLocaleString()} articles available`}
              className="ml-2 tabular-nums"
              style={{ color: "var(--text-3)" }}
            >
              {postCount.toLocaleString()} articles
            </span>
          )}
        </motion.p>

      </div>
    </header>
  )
}
