export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-[var(--text-3)]">
          <span className="text-[var(--accent)]">▸</span> jcrlabs tech blog · {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-3)]">
          <a href="/rss.xml" className="hover:text-[var(--accent)] transition-colors">rss</a>
          <a href="https://github.com/jcrlabs" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-2)] transition-colors">github</a>
          <a href="https://home.jcrlabs.net" className="hover:text-[var(--text-2)] transition-colors">portfolio</a>
        </div>
      </div>
    </footer>
  )
}
