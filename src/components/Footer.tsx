export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="safe-bottom"
      style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", paddingBottom: "2rem", marginTop: "2rem" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          AI·feed — curated AI/LLM/MCP intelligence
        </p>
        <nav aria-label="Footer links">
          <ul className="flex items-center gap-4 text-xs list-none" style={{ color: "var(--text-3)" }}>
            <li>
              <a
                href="/rss.xml"
                aria-label="RSS feed"
                className="hover:text-[var(--accent)] transition-colors"
                style={{ color: "inherit" }}
              >
                RSS
              </a>
            </li>
            <li>
              <a
                href="https://github.com/jcrlabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="jcrlabs on GitHub (opens in new tab)"
                className="transition-colors hover:text-[var(--text-2)]"
                style={{ color: "inherit" }}
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://home.jcrlabs.net"
                aria-label="Portfolio"
                className="transition-colors hover:text-[var(--text-2)]"
                style={{ color: "inherit" }}
              >
                Portfolio
              </a>
            </li>
            <li aria-label="Update frequency">
              <span>Updated every 6h</span>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
