export type SourceTier = "LAB" | "RESEARCH" | "EXPERT" | "COMMUNITY"

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
  sourceTier?: SourceTier | null
  tagNames: string[]
  createdAt: string
  favorited: boolean
}

export interface Count { key: string; count: number; tier?: SourceTier | null }

export interface FeedStats {
  total: number
  updatedAt?: string | null
  tiers: Count[]
  tags: Count[]
  sources: Count[]
}

export interface FeedFilter {
  tier?: SourceTier
  tag?: string
  search?: string
}

export interface Category {
  id: string
  name: string
  slug: string
}
