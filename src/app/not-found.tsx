import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--accent)] font-mono text-sm mb-2">404</p>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-4">Post not found</h1>
        <p className="text-[var(--text-2)] mb-8">The post you&apos;re looking for doesn&apos;t exist or was removed.</p>
        <Link href="/" className="text-[var(--accent-2)] hover:underline font-mono text-sm">
          ← back to blog
        </Link>
      </div>
    </div>
  )
}
