import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI·feed — The AI Engineer Intelligence Feed",
    short_name: "AI·feed",
    description: "Curated insights on LLMs, MCP, agents, RAG and AI architecture.",
    theme_color: "#0c0a09",
    background_color: "#0c0a09",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    categories: ["news", "education", "technology"],
    icons: [
      { src: "/icon-192.png",        sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png",        sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "Latest Articles", url: "/", description: "Browse the latest AI articles" },
    ],
  }
}
