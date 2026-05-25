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

interface Props {
  onLoad?: (count: number) => void
  onPostsLoaded?: (posts: Post[]) => void
  activeFilter?: string
  onFilterChange?: (key: string) => void
}

export function PostGrid({ onLoad, onPostsLoaded, activeFilter: externalFilter, onFilterChange }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [cursor, setCursor] = useState<string | undefined>()
  const [internalFilter, setInternalFilter] = useState("all")
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-40px" })
  const searchId = useId()
  const statusId = useId()

  // Use external filter if provided (sidebar-controlled), else internal
  const activeKey = externalFilter ?? internalFilter
  function setActiveKey(key: string) {
    if (onFilterChange) onFilterChange(key)
    else setInternalFilter(key)
  }

  useEffect(() => {
    fetchPosts().then(({ posts: p, hasMore: h, cursor: c }) => {
      setPosts(p)
      setHasMore(h)
      setCursor(c)
      setLoading(false)
      onLoad?.(p.length)
      onPostsLoaded?.(p)
    })
  }, [onLoad, onPostsLoaded])

  async function loadMore() {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    const { posts: more, hasMore: h, cursor: c } = await fetchPosts(cursor)
    setPosts(prev => [...prev, ...more])
    setHasMore(h)
    setCursor(c)
    setLoadingMore(false)
  }

  const activeFilter = FILTERS.find(f => f.key === activeKey) ?? FILTERS[0]
  const filtered = posts.filter(p => {
    if (!activeFilter.match(p.source ?? "", p.tagNames ?? [])) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const [featured, ...rest] = filtered
  const showFeatured = !search && activeKey === "all" && !loading && !!featured

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
              <span style={{ color: "var(--text-2)" }} className="tabular-nums">{filtered.length}</span>
              {" "}art{filtered.length !== 1 ? "s" : ""}
              {search && (
                <> · <span style={{ color: "var(--accent)" }}>&ldquo;{search}&rdquo;</span></>
              )}
            </span>
          )}
        </div>
      </motion.div>

      {/* Content area */}
      <div style={{ padding: "16px 20px" }}>
        {!loading && filtered.length === 0 ? (
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
                {showFeatured && (
                  <PostCard post={featured} index={0} featured />
                )}

                {/* Grid of remaining articles */}
                <div className="posts-grid">
                  {(showFeatured ? rest : filtered).map((post, i) => (
                    <PostCard key={post.id} post={post} index={showFeatured ? i + 1 : i} />
                  ))}
                </div>
              </div>
            )}

            {/* Load more */}
            {hasMore && !search && (
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
