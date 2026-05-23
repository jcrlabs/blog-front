"use client"

import { useState, useCallback } from "react"
import { Hero } from "./Hero"
import { PostGrid } from "./PostGrid"

export function HomeClient() {
  const [postCount, setPostCount] = useState(0)
  const handleLoad = useCallback((n: number) => setPostCount(n), [])

  return (
    <>
      <Hero postCount={postCount} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "1.5rem" }} />
      </div>
      <main id="main-content" tabIndex={-1}>
        <PostGrid onLoad={handleLoad} />
      </main>
    </>
  )
}
