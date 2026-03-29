import type { Post } from "@/lib/types"

interface Props { post: Post }

export function PostContent({ post }: Props) {
  if (post.sourceUrl) {
    return (
      <div className="text-center py-16">
        <div className="inline-block border border-[var(--border-2)] rounded-xl p-8 bg-[var(--surface)]">
          <p className="text-[var(--text-2)] font-mono text-sm mb-2">External article</p>
          <p className="text-[var(--text-3)] text-xs mb-6 max-w-sm">
            {post.summary}
          </p>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg font-mono text-sm text-[#a78bfa] hover:bg-[var(--accent)]/20 transition-colors"
          >
            read on {post.source}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  if (!post.content) {
    return <div className="prose-tech">{post.summary}</div>
  }

  return (
    <article className="prose-tech">
      <p className="text-[var(--text-2)]">{post.summary}</p>
    </article>
  )
}
