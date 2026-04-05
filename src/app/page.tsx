"use client"

import { useState } from "react"
import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { PostGrid } from "@/components/PostGrid"
import { Footer } from "@/components/Footer"

export default function Home() {
  const [postCount, setPostCount] = useState(0)

  return (
    <div className="min-h-screen">
      <Nav />
      <Hero postCount={postCount} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <PostGrid onLoad={setPostCount} />
      </main>
      <Footer />
    </div>
  )
}
