"use client"

import { motion } from "framer-motion"

interface Props { postCount: number }

export function Hero({ postCount }: Props) {
  return (
    <section className="relative pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[var(--accent)] opacity-[0.035] blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/6 text-[11px] font-semibold tracking-widest uppercase text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Live · Updated every 6h
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-4"
        >
          <span className="text-[var(--text)]">The AI Engineer</span>
          <br />
          <span className="gradient-text">Intelligence Feed</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-[var(--text-2)] text-base sm:text-lg max-w-xl leading-relaxed mb-8"
        >
          Curated insights on LLMs, MCP, agents, RAG and AI architecture —
          from Anthropic, OpenAI, Hugging Face and the best independent researchers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center gap-6"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[var(--text)]">{postCount > 0 ? postCount.toLocaleString() : "—"}</span>
            <span className="text-[11px] text-[var(--text-3)] uppercase tracking-wider">articles</span>
          </div>
          <div className="w-px h-5 bg-[var(--border-2)]" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[var(--text)]">25+</span>
            <span className="text-[11px] text-[var(--text-3)] uppercase tracking-wider">sources</span>
          </div>
          <div className="w-px h-5 bg-[var(--border-2)]" />
          <div className="flex flex-wrap gap-1.5 items-center">
            {["Anthropic", "OpenAI", "HuggingFace", "LangChain", "Mistral", "+more"].map((s) => (
              <span key={s} className="tag text-[10.5px]">{s}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
