"use client"

import { motion } from "framer-motion"

interface Props {
  postCount: number
}

export function Hero({ postCount }: Props) {
  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent-2)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Terminal header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-md border border-[var(--border-2)] bg-[var(--surface)] text-xs font-mono text-[var(--text-3)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
          <span>LIVE</span>
          <span className="text-[var(--border-2)]">·</span>
          <span>{postCount} posts indexed</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
            <span className="gradient-text">Tech Blog</span>
          </h1>
          <p className="text-[var(--text-2)] text-base sm:text-lg max-w-2xl leading-relaxed">
            Kubernetes, DevOps, Cloud Native — curated from CNCF, dev.to, and the ecosystem.
            <br />
            <span className="text-[var(--text-3)] text-sm">Auto-ingested every 6h · Original content from the cluster.</span>
          </p>
        </motion.div>

        {/* Sources bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 mt-8"
        >
          {["kubernetes.io", "cncf.io", "dev.to", "grafana.com", "cilium.io", "argoproj.io"].map((src) => (
            <span key={src} className="tag">
              {src}
            </span>
          ))}
          <span className="tag text-[var(--text-3)]">+more</span>
        </motion.div>
      </div>
    </section>
  )
}
