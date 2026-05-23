"use client"

import { useState } from "react"
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
  if (!source) return "source"
  const map: Record<string, string> = {
    "Anthropic Blog": "Anthropic",
    "OpenAI Blog": "OpenAI",
    "Google DeepMind": "DeepMind",
    "Hugging Face Blog": "HuggingFace",
    "Simon Willison": "simonw",
    "Chip Huyen": "huyenchip",
    "Sebastian Raschka": "raschka",
    "The Batch": "The Batch",
    "LangChain Blog": "LangChain",
    "LlamaIndex Blog": "LlamaIndex",
    "Mistral AI": "Mistral",
    "Towards Data Science": "TDS",
    "AssemblyAI Blog": "AssemblyAI",
    "Together AI": "Together AI",
    "Cohere Blog": "Cohere",
  }
  if (map[source]) return map[source]
  if (source.startsWith("dev.to")) return "dev.to"
  if (source.startsWith("Medium")) return "Medium"
  return source.split(" ")[0].slice(0, 12)
}

function sourceColor(source?: string): string {
  if (!source) return "var(--accent)"
  if (source.includes("Anthropic")) return "#d4893a"
  if (source.includes("OpenAI")) return "#10a37f"
  if (source.includes("DeepMind") || source.includes("Google")) return "#4285f4"
  if (source.includes("Hugging")) return "#ff9d00"
  if (source.includes("Mistral")) return "#f97316"
  if (source.startsWith("Medium")) return "#54a0dc"
  if (source.startsWith("dev.to")) return "#08b6ae"
  if (source.includes("LangChain")) return "#1c7ed6"
  if (source.includes("LlamaIndex")) return "#9333ea"
  if (source.includes("Simon") || source.includes("simonw")) return "#e879f9"
  if (source.includes("Chip") || source.includes("huyen")) return "#f472b6"
  if (source.includes("Batch") || source.includes("deeplearning")) return "#60a5fa"
  return "var(--accent)"
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://tech-blog-api.jcrlabs.net"

async function toggleFavoriteApi(id: string): Promise<boolean> {
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `mutation { toggleFavorite(id: "${id}") { id favorited } }` }),
  })
  const { data } = await res.json()
  return data?.toggleFavorite?.favorited ?? false
}

interface Props { post: Post; index: number }

export function PostCard({ post, index }: Props) {
  const [favorited, setFavorited] = useState(post.favorited)
  const [saving, setSaving] = useState(false)

  const color = sourceColor(post.source)
  const label = sourceLabel(post.source)
  const isExternal = !post.content && !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`
  const dateStr = formatDate(post.publishedAt ?? post.createdAt)

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (saving) return
    setSaving(true)
    const next = await toggleFavoriteApi(post.id)
    setFavorited(next)
    setSaving(false)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.03, 0.3),
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-label={`${post.title}, from ${label}, ${dateStr}`}
      className="h-full"
    >
      <div
        className="card"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <span
            className="source-badge"
            style={{ color }}
            aria-label={`Source: ${label}`}
          >
            {label}
          </span>
          <time
            dateTime={post.publishedAt ?? post.createdAt}
            className="text-xs tabular-nums"
            style={{ color: "var(--text-3)" }}
          >
            {dateStr}
          </time>
        </div>

        {/* ── Body ── */}
        <a
          href={href}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          tabIndex={0}
          className="block flex-1 px-4 py-3 group"
          aria-label={isExternal ? `${post.title} — opens on ${label}` : post.title}
        >
          <h2
            className="font-semibold leading-snug mb-2 line-clamp-3 transition-colors group-hover:text-white"
            style={{
              fontSize: "15px",
              color: "var(--text)",
              fontFamily: "var(--font-newsreader), Georgia, serif",
            }}
          >
            {post.title}
          </h2>
          {post.summary && (
            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{ color: "var(--text-3)" }}
            >
              {post.summary}
            </p>
          )}
        </a>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-4 pb-4 pt-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-1 min-w-0 mr-2" aria-label="Tags">
            {post.tagNames.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleFavorite}
              disabled={saving}
              aria-label={favorited ? `Remove "${post.title}" from saved` : `Save "${post.title}"`}
              aria-pressed={favorited}
              className="icon-btn"
              style={favorited ? { color: "#fbbf24" } : undefined}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={favorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>

            {isExternal && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open "${post.title}" on ${label} (opens in new tab)`}
                className="icon-btn"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
