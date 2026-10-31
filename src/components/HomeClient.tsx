"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    fetchStats().then(setStats)
  }, [])

  return (
    <>
      <Hero stats={stats} />
      <div className="app-layout">
        <Sidebar stats={stats} filter={filter} onFilterChange={setFilter} />
        <main id="main-content" tabIndex={-1} style={{ minWidth: 0 }}>
          <PostGrid filter={filter} onFilterChange={setFilter} />
        </main>
      </div>
    </>
  )
}
