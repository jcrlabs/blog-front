"use client"

import type { CSSProperties, MouseEvent } from "react"
import { motion } from "framer-motion"
import type { Post } from "@/lib/types"
import { sourceColor, sourceLabel, tierMeta } from "@/lib/sources"

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Feeds the radial hover glow in .card::after
function trackPointer(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
}

function Arrow() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

interface Props { post: Post; index: number; featured?: boolean }

export function PostCard({ post, index, featured = false }: Props) {
  const color = sourceColor(post.source, post.sourceTier)
  const label = sourceLabel(post.source)
  const tier = tierMeta(post.sourceTier)
  const isExternal = !post.content && !!post.sourceUrl
  const href = isExternal ? post.sourceUrl! : `/post/${post.slug}`
  const published = post.publishedAt ?? post.createdAt
  const dateStr = formatDate(published)
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}
  const style = { "--c": color } as CSSProperties

  if (featured) {
    let host = ""
    try { host = post.sourceUrl ? new URL(post.sourceUrl).hostname.replace(/^www\./, "") : "" } catch { /* ignore */ }
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <a href={href} {...linkProps} className="featured" style={style} aria-label={`Featured: ${post.title}, from ${label}`}>
          <div style={{ minWidth: 0 }}>
            <span className="featured-label"><span className="pulse-dot" style={{ background: color }} aria-hidden="true" />Top story · {label}</span>
            <h2 className="featured-title">{post.title}</h2>
            {post.summary && <p className="featured-summary">{post.summary}</p>}
            <span className="featured-cta">Read on {host || label} <Arrow /></span>
          </div>
          <div className="terminal" aria-hidden="true">
            <div className="terminal-bar"><i /><i /><i /><span>~/feed/top-story.json</span></div>
            <div className="terminal-body">
              <div><span className="k">{"{"}</span></div>
              <div>&nbsp;&nbsp;<span className="k">&quot;source&quot;:</span> <span className="s">&quot;{label}&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className="k">&quot;tier&quot;:</span> <span className="s">&quot;{tier?.label.toLowerCase() ?? "unknown"}&quot;</span>,</div>
              <div>&nbsp;&nbsp;<span className="k">&quot;published&quot;:</span> <span className="v">&quot;{dateStr}&quot;</span>,</div>
              {post.tagNames.length > 0 && (
                <div>&nbsp;&nbsp;<span className="k">&quot;tags&quot;:</span> <span className="v">[{post.tagNames.slice(0, 3).map(t => `"${t}"`).join(", ")}]</span>,</div>
              )}
              <div>&nbsp;&nbsp;<span className="k">&quot;host&quot;:</span> <span className="v">&quot;{host}&quot;</span></div>
              <div><span className="k">{"}"}</span> <span className="cursor" /></div>
            </div>
          </div>
        </a>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.25), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href={href} {...linkProps} className="card" style={style} onMouseMove={trackPointer} aria-label={`${post.title}, from ${label}, ${dateStr}`}>
        <div className="card-meta">
          <span className="card-source"><i aria-hidden="true" /><span>{label}</span></span>
          {tier && <span className="card-tier">{tier.label}</span>}
          <time className="card-time" dateTime={published}>{dateStr}</time>
        </div>
        <h3 className="card-title">{post.title}</h3>
        {post.summary && <p className="card-summary">{post.summary}</p>}
        <div className="card-foot">
          <div className="tags" aria-label="Tags">
            {post.tagNames.slice(0, 3).map(tag => <span key={tag} className="tag">#{tag}</span>)}
          </div>
          <span className="card-arrow" aria-hidden="true"><Arrow /></span>
        </div>
      </a>
    </motion.div>
  )
}
