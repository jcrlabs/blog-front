const RSS_URL = "https://tech-blog-api.jcrlabs.net/api/rss.xml"

export function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer-inner">
        <span>AI·feed — built by jcrlabs · links point to the original authors</span>
        <nav aria-label="Footer links">
          <a href={RSS_URL}>rss</a>
          <a href="https://github.com/jcrlabs" target="_blank" rel="noopener noreferrer">github</a>
          <a href="https://home.jcrlabs.net">portfolio</a>
        </nav>
      </div>
    </footer>
  )
}
