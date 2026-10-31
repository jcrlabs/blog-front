"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { PostCard } from "./PostCard"
import { GET_POSTS } from "@/lib/queries"
import { TIERS } from "@/lib/sources"
import type { FeedFilter, Post } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://tech-blog-api.jcrlabs.net"
const PAGE_SIZE = 24

// Cursor matches the API sort order: base64("<publishedAt>|<id>")
function cursorFor(post?: Post): string | undefined {
  if (!post) return undefined
  return btoa(`${post.publishedAt ?? post.createdAt}|${post.id}`)
}

async function fetchPosts(filter: FeedFilter, after?: string): Promise<{ posts: Post[]; hasMore: boolean }> {
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_POSTS,
        variables: {
          filter: { tier: filter.tier, tag: filter.tag, search: filter.search || undefined },
          pagination: { first: PAGE_SIZE + 1, ...(after ? { after } : {}) },
        },
      }),
    })
    const { data } = await res.json()
    const all: Post[] = data?.posts ?? []
    const hasMore = all.length > PAGE_SIZE
    return { posts: hasMore ? all.slice(0, PAGE_SIZE) : all, hasMore }
  } catch {
    return { posts: [], hasMore: false }
  }
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diff = Math.round((startOf(today) - startOf(d)) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
}

function groupByDay(posts: Post[]): { day: string; posts: Post[] }[] {
  const groups: { day: string; posts: Post[] }[] = []
  for (const p of posts) {
    const day = dayLabel(p.publishedAt ?? p.createdAt)
    const last = groups[groups.length - 1]
    if (last?.day === day) last.posts.push(p)
    else groups.push({ day, posts: [p] })
  }
  return groups
}

interface Props {
  filter: FeedFilter
  onFilterChange: (f: FeedFilter) => void
  onClear: () => void
}

export function PostGrid({ filter, onFilterChange, onClear }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPosts(filter).then(({ posts: p, hasMore: h }) => {
      if (cancelled) return
      setPosts(p)
      setHasMore(h)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [filter])

  async function loadMore() {
    if (loadingMore) return
    setLoadingMore(true)
    const { posts: more, hasMore: h } = await fetchPosts(filter, cursorFor(posts[posts.length - 1]))
    setPosts(prev => [...prev, ...more])
    setHasMore(h)
    setLoadingMore(false)
  }

  const isFiltered = !!(filter.tier || filter.tag || filter.search)
  // Featured slot goes to the freshest post from a lab or researcher, never a community repost
  const featured = isFiltered ? undefined : posts.find(p => p.sourceTier === "LAB" || p.sourceTier === "RESEARCH")
  const rest = featured ? posts.filter(p => p.id !== featured.id) : posts
  const groups = groupByDay(rest)

  return (
    <div>
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Filter by source type">
          {[{ key: undefined, label: "All", color: "var(--accent)" }, ...TIERS].map(t => (
            <button
              key={t.label}
              className={filter.tier === t.key ? "active" : ""}
              style={{ "--c": t.color } as CSSProperties}
              onClick={() => onFilterChange({ ...filter, tier: t.key })}
              aria-pressed={filter.tier === t.key}
            >
              <i aria-hidden="true" />{t.label}
            </button>
          ))}
        </div>

        {(filter.tag || filter.search) && (
          <button className="chip-clear" onClick={onClear} aria-label="Clear filters">
            {filter.tag ? `#${filter.tag}` : `"${filter.search}"`} ✕
          </button>
        )}

        <div className="toolbar-status" role="status" aria-live="polite">
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span className="spinner" aria-hidden="true" />fetching…</span>
          ) : (
            <><strong>{posts.length}{hasMore ? "+" : ""}</strong> articles</>
          )}
        </div>
      </div>

      <div className="feed">
        {loading ? (
          <div aria-hidden="true">
            <div className="skeleton" style={{ height: 220, borderRadius: 16, margin: "20px 0 28px" }} />
            <div className="posts-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="card" style={{ minHeight: 168 }}>
                  <div className="skeleton" style={{ height: 12, width: "45%", marginBottom: 14 }} />
                  <div className="skeleton" style={{ height: 16, width: "95%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 14 }} />
                  <div className="skeleton" style={{ height: 12, width: "85%" }} />
                </div>
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty" role="status">
            <b>Nothing matches that.</b>
            Try another topic or clear the search.
            <div style={{ marginTop: 18 }}><button className="btn-ghost" onClick={onClear}>Reset filters</button></div>
          </div>
        ) : (
          <>
            {featured && <PostCard post={featured} index={0} featured />}

            {groups.map(g => (
              <section key={g.day} aria-label={g.day}>
                <h2 className="day-heading">{g.day} <span>{g.posts.length} posts</span></h2>
                <div className="posts-grid">
                  {g.posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                </div>
              </section>
            ))}

            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 36 }}>
                <button onClick={loadMore} disabled={loadingMore} className="btn-ghost">
                  {loadingMore ? <><span className="spinner" aria-hidden="true" />Loading…</> : "Load older articles"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
