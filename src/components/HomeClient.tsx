"use client"

import { useCallback, useEffect, useState } from "react"
import { Nav } from "./Nav"
import { Hero } from "./Hero"
import { PostGrid } from "./PostGrid"
import { Sidebar } from "./Sidebar"
import { GET_FEED_STATS } from "@/lib/queries"
import type { FeedFilter, FeedStats } from "@/lib/types"

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://tech-blog-api.jcrlabs.net"

async function fetchStats(): Promise<FeedStats | null> {
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_FEED_STATS }),
    })
    const { data } = await res.json()
    return data?.feedStats ?? null
  } catch {
    return null
  }
}

export function HomeClient() {
  const [stats, setStats] = useState<FeedStats | null>(null)
  const [filter, setFilter] = useState<FeedFilter>({})
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchStats().then(setStats)
  }, [])

  // Debounce the search box into the filter so the query runs server-side
  useEffect(() => {
    const t = setTimeout(() => {
      const term = search.trim() || undefined
      setFilter(f => (f.search === term ? f : { ...f, search: term }))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const clearFilters = useCallback(() => {
    setSearch("")
    setFilter({})
  }, [])

  return (
    <>
      <Nav search={search} onSearch={setSearch} />
      <Hero stats={stats} filter={filter} onFilterChange={setFilter} />
      <div className="app-layout">
        <Sidebar stats={stats} filter={filter} onFilterChange={setFilter} />
        <main id="main-content" tabIndex={-1} style={{ minWidth: 0 }}>
          <PostGrid filter={filter} onFilterChange={setFilter} onClear={clearFilters} />
        </main>
      </div>
    </>
  )
}
