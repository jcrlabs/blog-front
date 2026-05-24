"use client"

import { useState, useEffect, useRef, useId } from "react"
import { motion, useInView } from "framer-motion"
import { PostCard } from "./PostCard"
import { GET_POSTS } from "@/lib/queries"
import type { Post } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://tech-blog-api.jcrlabs.net"
const PAGE_SIZE = 24

async function fetchPosts(after?: string): Promise<{ posts: Post[]; hasMore: boolean; cursor?: string }> {
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_POSTS,
        variables: { pagination: { first: PAGE_SIZE + 1, ...(after ? { after } : {}) } },
      }),
    })
    const { data } = await res.json()
    const all: Post[] = data?.posts ?? []
    const hasMore = all.length > PAGE_SIZE
    const posts = hasMore ? all.slice(0, PAGE_SIZE) : all
    const lastId = posts[posts.length - 1]?.id
    const cursor = lastId ? Buffer.from(lastId).toString("base64") : undefined
    return { posts, hasMore, cursor }
  } catch {
    return { posts: [], hasMore: false }
  }
}

const RESEARCH_SOURCES = [
  "Anthropic Blog", "OpenAI Blog", "Google DeepMind",
  "Hugging Face Blog", "Sebastian Raschka", "Chip Huyen", "The Batch",
]

const FILTERS = [
  { key: "all",          label: "All",          match: (_s: string, _t: string[]) => true },
  { key: "llm",          label: "LLMs",         match: (_s: string, t: string[]) => t.some(x => ["llm","openai","anthropic","gemini","mistral","open-source"].includes(x)) },
  { key: "mcp",          label: "MCP",          match: (_s: string, t: string[]) => t.includes("mcp") },
  { key: "agents",       label: "Agents",       match: (_s: string, t: string[]) => t.includes("agents") },
  { key: "rag",          label: "RAG",          match: (_s: string, t: string[]) => t.includes("rag") || t.includes("vector-db") },
  { key: "fine-tuning",  label: "Fine-tuning",  match: (_s: string, t: string[]) => t.includes("fine-tuning") },
  { key: "architecture", label: "Architecture", match: (_s: string, t: string[]) => t.includes("architecture") || t.includes("mlops") },
  { key: "prompting",    label: "Prompting",    match: (_s: string, t: string[]) => t.includes("prompting") },
  { key: "research",     label: "Research",     match: (s: string, _t: string[]) => RESEARCH_SOURCES.includes(s) },
]

interface Props { onLoad?: (count: number) => void }

export function PostGrid({ onLoad }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [cursor, setCursor] = useState<string | undefined>()
  const [activeKey, setActiveKey] = useState("all")
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-40px" })
  const searchId = useId()
  const statusId = useId()

  useEffect(() => {
    fetchPosts().then(({ posts: p, hasMore: h, cursor: c }) => {
      setPosts(p); setHasMore(h); setCursor(c); setLoading(false); onLoad?.(p.length)
    })
  }, [onLoad])

  async function loadMore() {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    const { posts: more, hasMore: h, cursor: c } = await fetchPosts(cursor)
    setPosts(prev => [...prev, ...more])
    setHasMore(h); setCursor(c); setLoadingMore(false)
  }

  const activeFilter = FILTERS.find(f => f.key === activeKey) ?? FILTERS[0]
  const filtered = posts.filter(p => {
    if (!activeFilter.match(p.source ?? "", p.tagNames ?? [])) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const [featured] = filtered
  const showFeatured = !search && activeKey === "all" && !loading && !!featured

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">

      {/* ── Toolbar: filters + search ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Search + filter row */}
        <div className="flex items-center gap-3">
          {/* Filter dropdown */}
          <div className="relative flex-shrink-0">
            <label htmlFor="topic-filter" className="sr-only">Filter by topic</label>
            <select
              id="topic-filter"
              value={activeKey}
              onChange={e => setActiveKey(e.target.value)}
              className="filter-select"
              aria-label="Filter articles by topic"
            >
              {FILTERS.map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
              style={{ color: "var(--text-3)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          <div role="search" className="relative flex-1 max-w-sm">
            <label htmlFor={searchId} className="sr-only">Search articles</label>
            <svg
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--text-3)" }}
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

          {/* Live count */}
          <div
            id={statusId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-xs flex-shrink-0"
            style={{
              color: "var(--text-3)",
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                />
                Loading…
              </span>
            ) : (
              <span>
                <span className="tabular-nums" style={{ color: "var(--text-2)" }}>
                  {filtered.length}
                </span>{" "}
                art{filtered.length !== 1 ? "s" : ""}
                {search && (
                  <> · <span style={{ color: "var(--accent)" }}>&ldquo;{search}&rdquo;</span></>
                )}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Content ── */}
      {!loading && filtered.length === 0 ? (
        <div
          role="status"
          className="text-center py-24 text-sm"
          style={{ color: "var(--text-3)" }}
        >
          No articles found — try a different filter or search term.
        </div>
      ) : (
        <div className="mt-2">

          {/* Skeletons while loading */}
          {loading && (
            <div aria-hidden="true" className="flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderLeft: "3px solid transparent", paddingLeft: 14 }}>
                  <div className="py-4 space-y-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="skeleton h-2.5 w-32" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Article list */}
          {!loading && (
            <div className="flex flex-col" aria-label="Articles">
              {/* Featured first article — only on sm+ */}
              {showFeatured && (
                <div className="hidden sm:block">
                  <PostCard post={featured} index={0} featured />
                </div>
              )}

              {filtered.map((post, i) => (
                <div key={post.id} className={showFeatured && i === 0 ? "sm:hidden" : ""}>
                  <PostCard post={post} index={i} />
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !search && (
            <div className="flex justify-center pt-8">
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
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                    />
                    Loading…
                  </>
                ) : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
