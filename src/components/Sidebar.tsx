"use client"

import type { FeedFilter, FeedStats } from "@/lib/types"
import { TOPICS, sourceColor } from "@/lib/sources"

export function formatRelative(iso?: string | null): string {
  if (!iso) return "—"
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface Props {
  stats: FeedStats | null
  filter: FeedFilter
  onFilterChange: (f: FeedFilter) => void
}

export function Sidebar({ stats, filter, onFilterChange }: Props) {
  const tagCount = (key: string) => stats?.tags.find(r => r.key === key)?.count ?? 0
  const topics = TOPICS.filter(t => tagCount(t.key) > 0).sort((a, b) => tagCount(b.key) - tagCount(a.key))
  const topSources = stats?.sources.slice(0, 10) ?? []
  const max = topSources[0]?.count ?? 1

  return (
    <aside className="sidebar" aria-label="Topics and sources">
      <section>
        <div className="side-label">
          <span>Topics</span>
          {filter.tag && (
            <button className="mono" style={{ background: "none", border: 0, color: "var(--accent)", cursor: "pointer", fontSize: 10 }} onClick={() => onFilterChange({ ...filter, tag: undefined })}>
              clear
            </button>
          )}
        </div>
        <nav className="topic-list" aria-label="Filter by topic">
          {topics.map(t => {
            const active = filter.tag === t.key
            return (
              <button
                key={t.key}
                className={`topic${active ? " active" : ""}`}
                onClick={() => onFilterChange({ ...filter, tag: active ? undefined : t.key })}
                aria-pressed={active}
              >
                #{t.key} <b>{tagCount(t.key)}</b>
              </button>
            )
          })}
          {!stats && Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="skeleton" style={{ width: 60 + (i % 3) * 14, height: 24 }} />
          ))}
        </nav>
      </section>

      <section>
        <div className="side-label"><span>Top sources</span><span>14d</span></div>
        <div>
          {topSources.map(({ key, count, tier }) => {
            const color = sourceColor(key, tier)
            return (
              <div key={key} className="source-row">
                <div className="source-row-name"><i style={{ background: color }} aria-hidden="true" /><span>{key}</span></div>
                <span className="source-row-count">{count}</span>
                <div className="source-row-bar" aria-hidden="true">
                  <span style={{ width: `${(count / max) * 100}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="side-foot">
        <div>$ cron <span style={{ color: "var(--text-2)" }}>0 * * * *</span></div>
        <div>$ retention <span style={{ color: "var(--text-2)" }}>14d</span></div>
        <div>$ last_article <span style={{ color: "var(--accent)" }}>{formatRelative(stats?.updatedAt)}</span></div>
      </div>
    </aside>
  )
}
