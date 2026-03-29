"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-5 py-2.5 rounded-full border transition-all duration-300 ${
        scrolled
          ? "border-[var(--border-2)] bg-[var(--surface)]/90 backdrop-blur-md shadow-xl shadow-black/40"
          : "border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm"
      }`}
    >
      <Link href="/" className="font-mono text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors">
        <span className="text-[var(--accent)]">▸</span> jcrlabs
      </Link>
      <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-3)]">
        <Link href="/" className="hover:text-[var(--text-2)] transition-colors">blog</Link>
        <Link href="https://home.jcrlabs.net" className="hover:text-[var(--text-2)] transition-colors">portfolio</Link>
        <Link href="/rss.xml" className="hover:text-[var(--accent)] transition-colors">rss</Link>
      </div>
    </motion.nav>
  )
}
