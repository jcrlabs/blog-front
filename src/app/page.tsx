import { gqlFetch } from "@/lib/gql"
import { GET_POSTS } from "@/lib/queries"
import type { Post } from "@/lib/types"
import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { PostGrid } from "@/components/PostGrid"
import { Footer } from "@/components/Footer"

export const dynamic = 'force-dynamic'

async function getPosts(): Promise<Post[]> {
  try {
    const data = await gqlFetch<{ posts: Post[] }>(
      GET_POSTS,
      { pagination: { first: 500 } },
      300,
    )
    return data.posts ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen">
      <Nav />
      <Hero postCount={posts.length} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <PostGrid posts={posts} />
      </main>
      <Footer />
    </div>
  )
}
