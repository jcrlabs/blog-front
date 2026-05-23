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

  const statusMsg = loading
    ? "Loading articles…"
    : search
      ? `${filtered.length} article${filtered.length !== 1 ? "s" : ""} matching "${search}"`
      : `${filtered.length} article${filtered.length !== 1 ? "s" : ""}`

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">

      {/* ── Search + Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 space-y-3"
      >
        {/* Search */}
        <div role="search" className="relative">
          <label htmlFor={searchId} className="sr-only">Search articles</label>
          <svg
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
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

        {/* Filters */}
        <div
          role="group"
          aria-label="Filter articles by topic"
          className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5"
        >
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveKey(f.key)}
              className={`filter-btn${activeKey === f.key ? " active" : ""}`}
              aria-pressed={activeKey === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Status / count ── */}
      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="flex items-center gap-2 mb-5 h-5"
      >
        {loading ? (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-3)" }}>
            <div
              aria-hidden="true"
              className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
            Loading…
          </div>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-3)" }}>
            <span className="font-medium" style={{ color: "var(--text-2)" }}>{filtered.length}</span>
            {" "}article{filtered.length !== 1 ? "s" : ""}
            {search && (
              <span> matching <span style={{ color: "var(--accent)" }}>&ldquo;{search}&rdquo;</span></span>
            )}
          </span>
        )}
        {/* Visually hidden full status for screen readers */}
        <span className="sr-only">{statusMsg}</span>
      </div>

      {/* ── Grid ── */}
      {!loading && filtered.length === 0 ? (
        <div
          role="status"
          className="text-center py-24 text-sm"
          style={{ color: "var(--text-3)" }}
        >
          No articles found — try a different filter or search term.
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            aria-label="Articles"
          >
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}

            {/* Skeleton placeholders while loading */}
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} aria-hidden="true" className="card" style={{ borderLeft: "3px solid var(--border-2)" }}>
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="skeleton h-3 w-16" />
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-4/5" />
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-full mt-2" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
                <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="skeleton h-5 w-24" />
                </div>
              </div>
            ))}
          </div>

          {hasMore && !search && activeKey === "all" && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                aria-label={loadingMore ? "Loading more articles" : "Load more articles"}
                className="filter-btn px-8"
                style={{ minHeight: "44px" }}
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                    />
                    Loading…
                  </span>
                ) : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
