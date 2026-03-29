import type { Post } from "@/lib/types"
import Link from "next/link"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })
}

interface Props { post: Post }

export function PostHeader({ post }: Props) {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="font-mono text-xs text-[var(--text-3)] hover:text-[var(--accent)] transition-colors">
          ← back
        </Link>
        {post.sourceUrl && (
          <>
            <span className="text-[var(--text-3)]">·</span>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--accent-2)] hover:underline"
            >
              via {post.source}
            </a>
          </>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-3)]">
        <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        {post.tagNames.length > 0 && (
          <>
            <span className="text-[var(--border-2)]">·</span>
            <div className="flex gap-1 flex-wrap">
              {post.tagNames.map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
