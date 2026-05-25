"use client"

import type { Post } from "@/lib/types"

const FILTERS = [
  { key: "all",          label: "All" },
  { key: "llm",          label: "LLMs" },
  { key: "mcp",          label: "MCP" },
  { key: "agents",       label: "Agents" },
  { key: "rag",          label: "RAG" },
  { key: "fine-tuning",  label: "Fine-tuning" },
  { key: "architecture", label: "Architecture" },
  { key: "prompting",    label: "Prompting" },
  { key: "research",     label: "Research" },
]

const RESEARCH_SOURCES = [
  "Anthropic Blog", "OpenAI Blog", "Google DeepMind",
  "Hugging Face Blog", "Sebastian Raschka", "Chip Huyen", "The Batch",
]

function matchFilter(key: string, source: string, tags: string[]): boolean {
  switch (key) {
    case "all": return true
    case "llm": return tags.some(x => ["llm","openai","anthropic","gemini","mistral","open-source"].includes(x))
    case "mcp": return tags.includes("mcp")
    case "agents": return tags.includes("agents")
    case "rag": return tags.includes("rag") || tags.includes("vector-db")
    case "fine-tuning": return tags.includes("fine-tuning")
    case "architecture": return tags.includes("architecture") || tags.includes("mlops")
    case "prompting": return tags.includes("prompting")
    case "research": return RESEARCH_SOURCES.includes(source)
    default: return true
  }
}

function sourceColor(source?: string): string {
  if (!source) return "#6366f1"
  if (source.includes("Anthropic")) return "#d4893a"
  if (source.includes("OpenAI")) return "#10a37f"
  if (source.includes("DeepMind") || source.includes("Google")) return "#4285f4"
  if (source.includes("Hugging")) return "#ff9d00"
  if (source.includes("Mistral")) return "#f97316"
  if (source.startsWith("Medium")) return "#54a0dc"
  if (source.startsWith("dev.to")) return "#08b6ae"
  if (source.includes("LangChain")) return "#1c7ed6"
  if (source.includes("LlamaIndex")) return "#9333ea"
  if (source.includes("Simon")) return "#e879f9"
  if (source.includes("Chip") || source.includes("huyen")) return "#f472b6"
  if (source.includes("Batch") || source.includes("deeplearning")) return "#60a5fa"
  if (source.includes("Raschka")) return "#34d399"
  return "#6366f1"
}

function sourceLabel(source?: string): string {
  if (!source) return "Unknown"
  const map: Record<string, string> = {
    "Anthropic Blog": "Anthropic",
    "OpenAI Blog": "OpenAI",
    "Google DeepMind": "DeepMind",
    "Hugging Face Blog": "Hugging Face",
    "Simon Willison": "Simon Willison",
    "Chip Huyen": "Chip Huyen",
    "Sebastian Raschka": "S. Raschka",
    "The Batch": "The Batch",
    "LangChain Blog": "LangChain",
    "LlamaIndex Blog": "LlamaIndex",
    "Mistral AI": "Mistral",
    "Towards Data Science": "TDS",
    "AssemblyAI Blog": "AssemblyAI",
    "Together AI": "Together AI",
    "Cohere Blog": "Cohere",
  }
  if (map[source]) return map[source]
  if (source.startsWith("dev.to")) return "dev.to"
  if (source.startsWith("Medium")) return "Medium"
  return source.split(" ")[0].slice(0, 14)
}

interface Props {
  activeFilter: string
  onFilterChange: (key: string) => void
  posts: Post[]
}

export function Sidebar({ activeFilter, onFilterChange, posts }: Props) {
  // Count per filter
  const counts: Record<string, number> = {}
  for (const f of FILTERS) {
    if (f.key === "all") {
      counts[f.key] = posts.length
    } else {
      counts[f.key] = posts.filter(p => matchFilter(f.key, p.source ?? "", p.tagNames ?? [])).length
    }
  }

  // Top sources
  const sourceCounts: Record<string, number> = {}
  for (const p of posts) {
    if (p.source) sourceCounts[p.source] = (sourceCounts[p.source] ?? 0) + 1
  }
  const topSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  // Last update heuristic: most recent publishedAt
  const latestDate = posts.reduce<string | null>((acc, p) => {
    const d = p.publishedAt ?? p.createdAt
    if (!d) return acc
    if (!acc || d > acc) return d
    return acc
  }, null)

  function formatRelativeDate(iso: string | null): string {
    if (!iso) return "—"
    const d = new Date(iso)
    const now = new Date()
    const hours = Math.floor((now.getTime() - d.getTime()) / 3600000)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <aside
      className="sidebar"
      aria-label="Feed navigation and filters"
    >
      {/* Feed stats */}
      <div
        style={{
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-3)",
            marginBottom: 12,
          }}
        >
          Feed Status
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Articles
            </span>
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {posts.length}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Updated
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 6px rgba(232,74,46,0.6)",
                  animation: "pulse 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: "var(--text-2)",
                  letterSpacing: "0.03em",
                }}
              >
                {formatRelativeDate(latestDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic filters */}
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
        <div
          style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-3)",
            marginBottom: 6,
          }}
        >
          Topics
        </div>
        <nav aria-label="Filter by topic">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`sidebar-filter${activeFilter === f.key ? " active" : ""}`}
              aria-pressed={activeFilter === f.key}
              aria-label={`Filter by ${f.label}, ${counts[f.key] ?? 0} articles`}
            >
              {f.label}
              <span className="count" aria-hidden="true">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Top sources */}
      {topSources.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-3)",
              marginBottom: 10,
            }}
          >
            Top Sources
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {topSources.map(([src, count]) => {
              const color = sourceColor(src)
              const label = sourceLabel(src)
              return (
                <div
                  key={src}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 10px",
                    borderRadius: 5,
                    cursor: "default",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        fontSize: 12,
                        color: "var(--text-2)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: "var(--text-3)",
                    }}
                  >
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          AI·feed v0.2.22
        </span>
      </div>
    </aside>
  )
}
