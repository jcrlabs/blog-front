"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { Post } from "@/lib/types"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function sourceShort(source?: string): string {
  if (!source) return "original"
  if (source.includes("kubernetes")) return "k8s.io"
  if (source.includes("CNCF")) return "cncf.io"
  if (source.includes("dev.to")) return "dev.to"
  if (source.includes("Grafana")) return "grafana"
  if (source.includes("ArgoCD")) return "argocd"
  if (source.includes("Cilium")) return "cilium"
  if (source.includes("Cloudflare")) return "cf"
  if (source.includes("Prometheus")) return "prom"
  return source.split(" ")[0].toLowerCase().slice(0, 8)
}

interface Props {
  post: Post
  index: number
}

export function PostCard({ post, index }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  function onMouseMove(e: React.MouseEvent) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`)
  }

  const isExternal = !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card-hover group relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--border-2)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--accent)]/5 hover:-translate-y-0.5"
      style={{ "--glow-x": "50%", "--glow-y": "50%" } as React.CSSProperties}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(300px circle at var(--glow-x) var(--glow-y), rgba(124,58,237,0.06), transparent 50%)",
        }}
      />

      <div className="relative z-10 p-5 flex flex-col h-full min-h-[180px]">
        {/* Source + date */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded border border-[var(--accent)]/20">
            {sourceShort(post.source)}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-3)]">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold text-[var(--text)] leading-snug mb-2 group-hover:text-white transition-colors line-clamp-3">
          {post.title}
        </h2>

        {/* Summary */}
        {post.summary && (
          <p className="text-xs text-[var(--text-3)] leading-relaxed line-clamp-2 mb-auto">
            {post.summary}
          </p>
        )}

        {/* Tags */}
        {post.tagNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tagNames.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
            {post.tagNames.length > 3 && (
              <span className="tag text-[var(--text-3)]">+{post.tagNames.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* External indicator */}
      {isExternal && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3 text-[var(--text-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      )}
    </motion.a>
  )
}
