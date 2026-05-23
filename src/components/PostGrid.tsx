"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { PostCard } from "./PostCard"
import { GET_POSTS } from "@/lib/queries"
import type { Post } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://tech-blog-api.jcrlabs.net"

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_POSTS, variables: { pagination: { first: 500 } } }),
    })
    const { data } = await res.json()
    return data?.posts ?? []
  } catch {
    return []
  }
}

const RESEARCH_SOURCES = ["Anthropic Blog", "OpenAI Blog", "Google DeepMind", "Hugging Face Blog", "Sebastian Raschka", "Chip Huyen", "The Batch"]

const FILTERS: { key: string; label: string; match: (s: string, tags: string[]) => boolean }[] = [
  { key: "all",          label: "All",          match: () => true },
  { key: "llm",          label: "LLMs",         match: (_, t) => t.some(x => ["llm","openai","anthropic","gemini","mistral","open-source"].includes(x)) },
  { key: "mcp",          label: "MCP",          match: (_, t) => t.includes("mcp") },
  { key: "agents",       label: "Agents",       match: (_, t) => t.includes("agents") },
  { key: "rag",          label: "RAG",          match: (_, t) => t.includes("rag") || t.includes("vector-db") },
  { key: "fine-tuning",  label: "Fine-tuning",  match: (_, t) => t.includes("fine-tuning") },
  { key: "architecture", label: "Architecture", match: (_, t) => t.includes("architecture") || t.includes("mlops") },
  { key: "prompting",    label: "Prompting",    match: (_, t) => t.includes("prompting") },
  { key: "research",     label: "Research",     match: (s) => RESEARCH_SOURCES.includes(s) },
]

interface Props { onLoad?: (count: number) => void }

export function PostGrid({ onLoad }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeKey, setActiveKey] = useState("all")
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    fetchPosts().then((p) => { setPosts(p); setLoading(false); onLoad?.(p.length) })
  }, [onLoad])

  const activeFilter = FILTERS.find((f) => f.key === activeKey) ?? FILTERS[0]
  const filtered = posts.filter((p) => {
    if (!activeFilter.match(p.source ?? "", p.tagNames ?? [])) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-6 pt-2"
      >
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveKey(f.key)}
              className={`filter-btn ${activeKey === f.key ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        {loading ? (
          <div className="flex items-center gap-2 text-[var(--text-3)] text-sm">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            Loading articles...
          </div>
        ) : (
          <span className="text-sm text-[var(--text-3)]">
            <span className="text-[var(--text-2)] font-medium">{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""}
            {search && <span> matching <span className="text-[var(--accent)]">&ldquo;{search}&rdquo;</span></span>}
          </span>
        )}
      </motion.div>

      {!loading && filtered.length === 0 ? (
        <div className="text-center py-24 text-[var(--text-3)] text-sm">
          No articles found — try a different filter or search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
