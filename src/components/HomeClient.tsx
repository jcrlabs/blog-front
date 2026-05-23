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
      <main id="main-content" tabIndex={-1}>
        <PostGrid onLoad={handleLoad} />
      </main>
    </>
  )
}
