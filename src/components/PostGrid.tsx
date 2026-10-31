"use client"

import { useState, useEffect, useRef, useId } from "react"
import { motion, useInView } from "framer-motion"
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
}

export function PostGrid({ filter, onFilterChange }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-40px" })
  const searchId = useId()
  const statusId = useId()

  // Debounce the search box into the shared filter so the query runs server-side
  useEffect(() => {
    const t = setTimeout(() => {
      const term = search.trim()
      if ((filter.search ?? "") !== term) onFilterChange({ ...filter, search: term || undefined })
    }, 350)
    return () => clearTimeout(t)
  }, [search, filter, onFilterChange])

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
  const showFeatured = !loading && !!featured

  return (
    <div ref={ref} style={{ padding: "0 0 80px" }}>

      {/* Search toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div role="search" style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <label htmlFor={searchId} className="sr-only">Search articles</label>
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 13,
              height: 13,
              color: "var(--text-3)",
              pointerEvents: "none",
            }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            aria-controls={statusId}
            autoComplete="off"
          />
        </div>

        {/* Section chips — mobile only, the sidebar handles this on desktop */}
        <div className="mobile-tiers" role="group" aria-label="Filter by source type">
          {[{ key: undefined, label: "All" }, ...TIERS].map(t => (
            <button
              key={t.label}
              onClick={() => onFilterChange({ ...filter, tier: t.key })}
              className={`mobile-tier${filter.tier === t.key ? " active" : ""}`}
              aria-pressed={filter.tier === t.key}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Live count */}
        <div
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: "2px solid var(--accent)",
                  borderTopColor: "transparent",
                  display: "inline-block",
                }}
                className="animate-spin"
              />
              Loading…
            </span>
          ) : (
            <span>
              <span style={{ color: "var(--text-2)" }} className="tabular-nums">{posts.length}{hasMore ? "+" : ""}</span>
              {" "}article{posts.length !== 1 ? "s" : ""}
              {filter.search && (
                <> · <span style={{ color: "var(--accent)" }}>&ldquo;{filter.search}&rdquo;</span></>
              )}
            </span>
          )}
        </div>
      </motion.div>

      {/* Content area */}
      <div style={{ padding: "16px 20px" }}>
        {!loading && posts.length === 0 ? (
          <div
            role="status"
            style={{
              textAlign: "center",
              padding: "80px 0",
              fontSize: 14,
              color: "var(--text-3)",
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            }}
          >
            No articles found — try a different filter or search term.
          </div>
        ) : (
          <>
            {/* Skeletons while loading */}
            {loading && (
              <div aria-hidden="true" className="posts-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderLeft: "3px solid var(--border)",
                      borderRadius: 6,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div className="skeleton" style={{ height: 18, width: 70, borderRadius: 99 }} />
                      <div className="skeleton" style={{ height: 14, width: 50 }} />
                    </div>
                    <div className="skeleton" style={{ height: 17, width: "100%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 17, width: "80%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: "60%" }} />
                    <div className="skeleton" style={{ height: 13, width: "40%", marginTop: 6 }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <div aria-label="Articles">
                {/* Featured post */}
                {showFeatured && featured && (
                  <PostCard post={featured} index={0} featured />
                )}

                {/* Remaining articles, grouped by publication day */}
                {groups.map(g => (
                  <section key={g.day} aria-label={g.day}>
                    <h2 className="day-heading">{g.day}</h2>
                    <div className="posts-grid">
                      {g.posts.map((post, i) => (
                        <PostCard key={post.id} post={post} index={i} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  aria-label={loadingMore ? "Loading more articles" : "Load more articles"}
                  className="btn-outline"
                >
                  {loadingMore ? (
                    <>
                      <span
                        aria-hidden="true"
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: "2px solid var(--accent)",
                          borderTopColor: "transparent",
                          display: "inline-block",
                        }}
                        className="animate-spin"
                      />
                      Loading…
                    </>
                  ) : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
