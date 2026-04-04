"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { gqlAuth } from "@/lib/gql"
import { GET_PENDING_POSTS, APPROVE_POST, REJECT_POST } from "@/lib/queries"

interface PendingPost {
  id: string
  title: string
  summary?: string
  sourceUrl?: string
  source?: string
  tagNames: string[]
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PendingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") ?? "" : ""

  const loadPending = useCallback(async () => {
    if (!token) { router.push("/admin/login"); return }
    try {
      const data = await gqlAuth<{ pendingPosts: PendingPost[] }>(GET_PENDING_POSTS, token)
      setPosts(data.pendingPosts)
    } catch {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }, [token, router])

  useEffect(() => { loadPending() }, [loadPending])

  async function approve(id: string) {
    setActing(id)
    await gqlAuth(APPROVE_POST, token, { id })
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setActing(null)
  }

  async function reject(id: string) {
    setActing(id)
    await gqlAuth(REJECT_POST, token, { id })
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setActing(null)
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-white/40 text-sm">Cargando...</main>
  }

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold tracking-widest uppercase text-white/80">
          Moderación — {posts.length} pendientes
        </h1>
        <button
          onClick={() => { localStorage.removeItem("admin_token"); router.push("/admin/login") }}
          className="text-xs text-white/30 hover:text-white/60"
        >
          Salir
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-white/40 text-sm">No hay posts pendientes.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border border-white/10 rounded p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug">{post.title}</p>
                  {post.source && (
                    <p className="text-white/40 text-xs mt-1">
                      {post.source}
                      {post.sourceUrl && (
                        <>
                          {" · "}
                          <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
                            ver original
                          </a>
                        </>
                      )}
                    </p>
                  )}
                  {post.summary && (
                    <p className="text-white/50 text-xs mt-2 line-clamp-2">{post.summary}</p>
                  )}
                  {post.tagNames.length > 0 && (
                    <p className="text-white/30 text-xs mt-1">{post.tagNames.join(", ")}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approve(post.id)}
                    disabled={acting === post.id}
                    className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded text-white font-medium"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => reject(post.id)}
                    disabled={acting === post.id}
                    className="px-3 py-1 text-xs bg-red-700 hover:bg-red-600 disabled:opacity-40 rounded text-white font-medium"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
