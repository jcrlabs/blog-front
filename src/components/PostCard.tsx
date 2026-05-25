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

export function sourceLabel(source?: string): string {
  if (!source) return "Unknown"
  const map: Record<string, string> = {
    "Anthropic Blog": "Anthropic",
    "OpenAI Blog": "OpenAI",
    "Google DeepMind": "DeepMind",
    "Hugging Face Blog": "Hugging Face",
    "Simon Willison": "Simon Willison",
    "Chip Huyen": "Chip Huyen",
    "Sebastian Raschka": "S. Raschka",
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
  return source.split(" ")[0].slice(0, 14)
}

export function sourceColor(source?: string): string {
  if (!source) return "#6366f1"
  if (source.includes("Anthropic")) return "#d4893a"
  if (source.includes("OpenAI")) return "#10a37f"
  if (source.includes("DeepMind") || source.includes("Google")) return "#4285f4"
  if (source.includes("Hugging")) return "#ff9d00"
  if (source.includes("Mistral")) return "#f97316"
  if (source.startsWith("Medium")) return "#54a0dc"
  if (source.startsWith("dev.to")) return "#08b6ae"
  if (source.includes("LangChain")) return "#1c7ed6"
  if (source.includes("LlamaIndex")) return "#9333ea"
  if (source.includes("Simon")) return "#e879f9"
  if (source.includes("Chip") || source.includes("huyen")) return "#f472b6"
  if (source.includes("Batch") || source.includes("deeplearning")) return "#60a5fa"
  if (source.includes("Raschka")) return "#34d399"
  return "#6366f1"
}

function readingTime(title: string, summary?: string): number {
  if (!summary) return 0
  const words = (title + " " + summary).trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
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

interface Props { post: Post; index: number; featured?: boolean }

export function PostCard({ post, index, featured = false }: Props) {
  const [favorited, setFavorited] = useState(post.favorited)
  const [saving, setSaving] = useState(false)

  const color = sourceColor(post.source)
  const label = sourceLabel(post.source)
  const isExternal = !post.content && !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`
  const dateStr = formatDate(post.publishedAt ?? post.createdAt)
  const mins = readingTime(post.title, post.summary ?? undefined)

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (saving) return
    setSaving(true)
    const next = await toggleFavoriteApi(post.id)
    setFavorited(next)
    setSaving(false)
  }

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`Featured: ${post.title}, from ${label}, ${dateStr}`}
      >
        <a
          href={href}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="post-card-featured"
          aria-label={isExternal ? `${post.title} — opens on ${label}` : post.title}
        >
          {/* Left: content (70%) */}
          <div style={{ flex: "0 0 70%", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                className="source-pill"
                aria-label={`Source: ${label}`}
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                  color,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                {label}
              </span>
              <time
                dateTime={post.publishedAt ?? post.createdAt}
                style={{
                  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {dateStr}
              </time>
              {mins > 0 && (
                <span
                  aria-label={`${mins} minute read`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "var(--text-3)",
                    letterSpacing: "0.03em",
                  }}
                >
                  <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  {mins}m
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="post-card-title-featured">{post.title}</h2>

            {/* Summary */}
            {post.summary && (
              <p
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "var(--text-2)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  margin: 0,
                }}
              >
                {post.summary}
              </p>
            )}

            {/* Footer */}
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} aria-label="Tags">
                {post.tagNames.slice(0, 5).map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: "var(--text-3)",
                      textTransform: "lowercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <button
                  onClick={handleFavorite}
                  disabled={saving}
                  aria-label={favorited ? `Remove "${post.title}" from saved` : `Save "${post.title}"`}
                  aria-pressed={favorited}
                  className="icon-btn"
                  style={favorited ? { color: "#f59e0b" } : undefined}
                >
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"
                    fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.75}>
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
                    onClick={e => e.stopPropagation()}
                  >
                    <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: gradient image (30%) — desktop only */}
          <div
            aria-hidden="true"
            style={{
              flex: "0 0 30%",
              minHeight: 120,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${color}22 0%, ${color}08 50%, transparent 100%)`,
              border: `1px solid ${color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: 42,
                fontWeight: 700,
                color: `${color}30`,
                letterSpacing: "-0.04em",
                userSelect: "none",
              }}
            >
              {label.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </a>
      </motion.article>
    )
  }

  // Regular card
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${post.title}, from ${label}, ${dateStr}`}
    >
      <a
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="post-card"
        aria-label={isExternal ? `${post.title} — opens on ${label}` : post.title}
        style={{ borderLeftColor: "var(--border)" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 6 }}>
          <span
            className="source-pill"
            aria-label={`Source: ${label}`}
            style={{
              background: `${color}18`,
              border: `1px solid ${color}30`,
              color,
              flexShrink: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            {label}
          </span>
          <time
            dateTime={post.publishedAt ?? post.createdAt}
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            {dateStr}
          </time>
        </div>

        {/* Title */}
        <h2 className="post-card-title" style={{ marginBottom: 6 }}>{post.title}</h2>

        {/* Summary */}
        {post.summary && (
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-2)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            {post.summary}
          </p>
        )}

        {/* Footer */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1, minWidth: 0 }} aria-label="Tags">
            {post.tagNames.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-3)",
                  textTransform: "lowercase",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            {mins > 0 && (
              <span
                aria-label={`${mins} minute read`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-3)",
                  marginRight: 2,
                }}
              >
                <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {mins}m
              </span>
            )}
            <button
              onClick={handleFavorite}
              disabled={saving}
              aria-label={favorited ? `Remove "${post.title}" from saved` : `Save "${post.title}"`}
              aria-pressed={favorited}
              className="icon-btn"
              style={favorited ? { color: "#f59e0b" } : undefined}
            >
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24"
                fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.75}>
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
                onClick={e => e.stopPropagation()}
              >
                <svg aria-hidden="true" width="13" height="13" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </a>
    </motion.article>
  )
}
