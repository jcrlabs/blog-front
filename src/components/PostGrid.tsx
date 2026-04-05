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
      body: JSON.stringify({ query: GET_POSTS, variables: { pagination: { first: 100 } } }),
    })
    const { data } = await res.json()
    return data?.posts ?? []
  } catch {
    return []
  }
}

const SOURCES = ["all", "Kubernetes Blog", "CNCF Blog", "dev.to kubernetes", "Grafana Blog", "Cloudflare Blog"]

interface Props { onLoad?: (count: number) => void }

export function PostGrid({ onLoad }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSource, setActiveSource] = useState("all")
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    fetchPosts().then((p) => { setPosts(p); setLoading(false); onLoad?.(p.length) })
  }, [onLoad])

  const filtered = posts.filter((p) => {
    if (activeSource !== "all" && p.source !== activeSource) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mb-8 pt-4"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] font-mono text-sm">$</span>
          <input
            type="text"
            placeholder="grep posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg font-mono text-sm text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SOURCES.map((src) => (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                activeSource === src
                  ? "bg-[var(--accent)]/20 border border-[var(--accent)]/50 text-[#a78bfa]"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-2)] hover:text-[var(--text-2)]"
              }`}
            >
              {src === "all" ? "all" : src.split(" ")[0].toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-mono text-xs text-[var(--text-3)] mb-6"
      >
        {loading
          ? <span className="text-[var(--accent)]">loading...</span>
          : <><span className="text-[var(--accent)]">→</span> {filtered.length} results{search && <span className="text-[var(--text-3)]"> for &quot;{search}&quot;</span>}</>
        }
      </motion.p>

      {!loading && filtered.length === 0 ? (
        <div className="text-center py-24 text-[var(--text-3)] font-mono text-sm">
          no posts found — try adjusting your filter
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
