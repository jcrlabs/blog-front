"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

export function Hero({ postCount }: Props) {
  return (
    <section className="pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[10px] font-bold tracking-widest uppercase text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Live · Updated every 6h
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
            <span className="text-[var(--text)]">The AI Engineer </span>
            <span className="gradient-text">Intelligence Feed</span>
          </h1>

          <p className="text-[var(--text-2)] text-sm sm:text-base max-w-2xl leading-relaxed">
            Curated insights on LLMs, MCP, agents, RAG and AI architecture — from Anthropic,
            OpenAI, Hugging Face and the best independent researchers.
            {postCount > 0 && (
              <span className="ml-1.5 text-[var(--text-3)] text-sm">{postCount.toLocaleString()} articles</span>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
