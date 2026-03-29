export interface Post {
  id: string
  title: string
  slug: string
  summary?: string
  content?: Record<string, unknown>
  status: string
  publishedAt?: string
  sourceUrl?: string
  source?: string
  tagNames: string[]
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
}
