"use client"

import { motion } from "framer-motion"
import type { Post } from "@/lib/types"
import { sourceColor, sourceLabel, tierMeta } from "@/lib/sources"

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const hours = Math.floor((now.getTime() - d.getTime()) / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface Props { post: Post; index: number; featured?: boolean }

export function PostCard({ post, index, featured = false }: Props) {
  const color = sourceColor(post.source, post.sourceTier)
  const tier = tierMeta(post.sourceTier)
  const label = sourceLabel(post.source)
  const isExternal = !post.content && !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`
  const dateStr = formatDate(post.publishedAt ?? post.createdAt)

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
                {tier ? `${tier.label} · ` : ""}{dateStr}
              </time>
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
            {tier ? `${tier.label} · ` : ""}{dateStr}
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
