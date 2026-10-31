"use client"

import type { FeedFilter, FeedStats } from "@/lib/types"
import { TIERS, TOPICS, sourceColor } from "@/lib/sources"

const LABEL_STYLE = {
  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "var(--text-3)",
  marginBottom: 6,
}

const SECTION_STYLE = { marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }

export function formatRelative(iso?: string | null): string {
  if (!iso) return "—"
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface Props {
  stats: FeedStats | null
  filter: FeedFilter
  onFilterChange: (f: FeedFilter) => void
}

export function Sidebar({ stats, filter, onFilterChange }: Props) {
  const count = (rows: { key: string; count: number }[] | undefined, key: string) =>
    rows?.find(r => r.key === key)?.count ?? 0
  const topics = TOPICS.filter(t => count(stats?.tags, t.key) > 0)
  const topSources = stats?.sources.slice(0, 8) ?? []

  return (
    <aside className="sidebar" aria-label="Feed navigation and filters">
      {/* Sections: where the article comes from */}
      <div style={SECTION_STYLE}>
        <div style={LABEL_STYLE}>Sections</div>
        <nav aria-label="Filter by source type">
          <button
            onClick={() => onFilterChange({ ...filter, tier: undefined })}
            className={`sidebar-filter${!filter.tier ? " active" : ""}`}
            aria-pressed={!filter.tier}
          >
            Everything
            <span className="count" aria-hidden="true">{stats?.total ?? 0}</span>
          </button>
          {TIERS.map(t => (
            <button
              key={t.key}
              onClick={() => onFilterChange({ ...filter, tier: t.key })}
              className={`sidebar-filter${filter.tier === t.key ? " active" : ""}`}
              aria-pressed={filter.tier === t.key}
              title={t.hint}
            >
              {t.label}
              <span className="count" aria-hidden="true">{count(stats?.tiers, t.key)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Topics: what the article is about */}
      {topics.length > 0 && (
        <div style={SECTION_STYLE}>
          <div style={LABEL_STYLE}>Topics</div>
          <nav aria-label="Filter by topic">
            {topics.map(t => {
              const active = filter.tag === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => onFilterChange({ ...filter, tag: active ? undefined : t.key })}
                  className={`sidebar-filter${active ? " active" : ""}`}
                  aria-pressed={active}
                >
                  {t.label}
                  <span className="count" aria-hidden="true">{count(stats?.tags, t.key)}</span>
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Top sources over the whole retention window */}
      {topSources.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...LABEL_STYLE, marginBottom: 10 }}>Top sources · 14 days</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {topSources.map(({ key, count: n }) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    aria-hidden="true"
                    style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: sourceColor(key), flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: "var(--text-2)" }}>
                    {key}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-3)" }}>
                  {n}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--border)", ...LABEL_STYLE }}>
        Last article {formatRelative(stats?.updatedAt)}
      </div>
    </aside>
  )
}
