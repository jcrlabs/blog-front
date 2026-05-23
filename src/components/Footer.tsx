export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="safe-bottom"
      style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", paddingBottom: "2rem", marginTop: "2rem" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            AI
          </span>
          <span className="text-xs" style={{ color: "var(--text-3)" }}>
            Curated AI/LLM/MCP intelligence · Updated every 6h
          </span>
        </div>
        <nav aria-label="Footer links">
          <ul className="flex items-center gap-5 text-xs list-none" style={{ color: "var(--text-3)" }}>
            <li><a href="/rss.xml" aria-label="RSS feed" className="transition-colors hover:text-[var(--accent)]" style={{ color: "inherit" }}>RSS</a></li>
            <li><a href="https://github.com/jcrlabs" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)" className="transition-colors hover:text-[var(--text-2)]" style={{ color: "inherit" }}>GitHub</a></li>
            <li><a href="https://home.jcrlabs.net" className="transition-colors hover:text-[var(--text-2)]" style={{ color: "inherit" }}>Portfolio</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
