export interface Post {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
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
