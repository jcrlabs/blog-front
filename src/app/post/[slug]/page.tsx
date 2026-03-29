import { notFound } from "next/navigation"
import { getClient } from "@/lib/apollo"
import { GET_POST } from "@/lib/queries"
import type { Post } from "@/lib/types"
import { Nav } from "@/components/Nav"
import { PostHeader } from "@/components/PostHeader"
import { PostContent } from "@/components/PostContent"
import { Footer } from "@/components/Footer"

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await getClient().query({
      query: GET_POST,
      variables: { slug },
    })
    return data.post ?? null
  } catch {
    return null
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <PostHeader post={post} />
        <PostContent post={post} />
      </main>
      <Footer />
    </div>
  )
}
