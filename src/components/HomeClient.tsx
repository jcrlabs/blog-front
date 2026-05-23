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
      <div className="glow-line mb-8 max-w-6xl mx-auto px-4 sm:px-6" />
      <PostGrid onLoad={handleLoad} />
    </>
  )
}
