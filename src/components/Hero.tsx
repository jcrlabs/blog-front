"use client"

import type { CSSProperties } from "react"
import type { FeedFilter, FeedStats } from "@/lib/types"
import { TIERS } from "@/lib/sources"
import { formatRelative } from "./Sidebar"

interface Props {
  stats: FeedStats | null
  filter: FeedFilter
  onFilterChange: (f: FeedFilter) => void
}

export function Hero({ stats, filter, onFilterChange }: Props) {
  const total = stats?.total ?? 0
  const tierCount = (key: string) => stats?.tiers.find(t => t.key === key)?.count ?? 0
  const sourceCount = stats?.sources.length ?? 0

  const cards = [
    { key: undefined, label: "Everything", hint: `${sourceCount || "—"} sources tracked`, color: "var(--accent)", count: total },
    ...TIERS.map(t => ({ key: t.key, label: t.label, hint: t.hint, color: t.color, count: tierCount(t.key) })),
  ]

  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="eyebrow" role="status">
          <span className="pulse-dot" aria-hidden="true" />
          {stats?.updatedAt ? `live · last article ${formatRelative(stats.updatedAt)}` : "live · refreshed hourly"}
        </div>

        <h1 className="hero-title">
          AI engineering news, <span className="grad">straight from the source.</span>
        </h1>
        <p className="hero-sub">
          Hourly digest from AI labs, research groups, independent engineers and the community.
          Real publish dates, tagged by topic, 14-day window. No fluff, no reposts.
        </p>

        <div className="tier-strip" role="group" aria-label="Filter by source type">
          {cards.map(c => {
            const active = filter.tier === c.key
            const pct = total ? Math.round((c.count / total) * 100) : 0
            return (
              <button
                key={c.label}
                className={`tier-card${active ? " active" : ""}`}
                style={{ "--c": c.color } as CSSProperties}
                onClick={() => onFilterChange({ ...filter, tier: c.key })}
                aria-pressed={active}
              >
                <div className="tier-card-top">
                  <span className="tier-name"><i aria-hidden="true" />{c.label}</span>
                  {c.key && <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{pct}%</span>}
                </div>
                <div className="tier-count">{stats ? c.count.toLocaleString() : "—"}</div>
                <div className="tier-hint">{c.hint}</div>
                <div className="tier-bar" aria-hidden="true"><span style={{ width: `${c.key ? pct : 100}%` }} /></div>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
