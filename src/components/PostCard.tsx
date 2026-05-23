"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { Post } from "@/lib/types"

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function sourceLabel(source?: string): string {
  if (!source) return "original"
  const map: Record<string, string> = {
    "Anthropic Blog": "Anthropic", "OpenAI Blog": "OpenAI",
    "Google DeepMind": "DeepMind", "Hugging Face Blog": "HF",
    "Simon Willison": "simonw", "Chip Huyen": "huyenchip",
    "Sebastian Raschka": "raschka", "The Batch": "the batch",
    "LangChain Blog": "LangChain", "LlamaIndex Blog": "LlamaIndex",
    "Mistral AI": "Mistral", "Towards Data Science": "TDS",
    "AssemblyAI Blog": "AssemblyAI", "Together AI": "Together",
    "Cohere Blog": "Cohere",
  }
  if (map[source]) return map[source]
  if (source.startsWith("dev.to")) return "dev.to"
  if (source.startsWith("Medium")) return "medium"
  return source.split(" ")[0].slice(0, 10)
}

function sourceColor(source?: string): string {
  if (!source) return "var(--accent)"
  if (source.includes("Anthropic")) return "#c07a2e"
  if (source.includes("OpenAI")) return "#10a37f"
  if (source.includes("DeepMind") || source.includes("Google")) return "#4285f4"
  if (source.includes("Hugging")) return "#ff9d00"
  if (source.includes("Mistral")) return "#f97316"
  if (source.startsWith("Medium")) return "#54a0dc"
  if (source.startsWith("dev.to")) return "#08b6ae"
  if (source.includes("LangChain")) return "#1c7ed6"
  if (source.includes("LlamaIndex")) return "#9333ea"
  return "var(--accent)"
}

interface Props { post: Post; index: number }

export function PostCard({ post, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    el.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  const isExternal = !post.content && !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`
  const color = sourceColor(post.source)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="card card-accent group"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <a
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="relative z-10 flex flex-col min-h-[200px] p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <span
            className="source-badge"
            style={{ color, borderColor: `${color}35`, background: `${color}0e`, border: `1px solid ${color}35` }}
          >
            {sourceLabel(post.source)}
          </span>
          <time className="text-[11px] text-[var(--text-3)]" dateTime={post.publishedAt ?? post.createdAt}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h2 className="text-[13.5px] font-semibold text-[var(--text)] leading-snug mb-2.5 group-hover:text-white transition-colors line-clamp-3 flex-grow">
          {post.title}
        </h2>

        {/* Summary */}
        {post.summary && (
          <p className="text-[12px] text-[var(--text-3)] leading-relaxed line-clamp-2 mb-3">
            {post.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-1">
            {post.tagNames.slice(0, 3).map((tag) => (
              <span key={tag} className="tag text-[10.5px]">#{tag}</span>
            ))}
          </div>
          {isExternal && (
            <svg className="w-3.5 h-3.5 text-[var(--text-3)] flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </div>
      </a>
    </motion.div>
  )
}
