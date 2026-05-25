"use client"

import { useState, useCallback } from "react"
import { Hero } from "./Hero"
import { PostGrid } from "./PostGrid"
import { Sidebar } from "./Sidebar"
import type { Post } from "@/lib/types"

export function HomeClient() {
  const [postCount, setPostCount] = useState(0)
  const [posts, setPosts] = useState<Post[]>([])
  const [activeFilter, setActiveFilter] = useState("all")

  const handleLoad = useCallback((n: number) => setPostCount(n), [])
  const handlePostsLoaded = useCallback((p: Post[]) => setPosts(p), [])

  return (
    <>
      <Hero postCount={postCount} />
      <div className="app-layout">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          posts={posts}
        />
        <main id="main-content" tabIndex={-1} style={{ minWidth: 0 }}>
          <PostGrid
            onLoad={handleLoad}
            onPostsLoaded={handlePostsLoaded}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </main>
      </div>
    </>
  )
}
