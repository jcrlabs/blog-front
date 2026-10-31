import type { SourceTier } from "./types"

// Source tiers come from the API; this is the single place that maps them to UI labels/colors.
export const TIERS: { key: SourceTier; label: string; hint: string; color: string }[] = [
  { key: "LAB",       label: "Labs",      hint: "Official blogs from AI labs and platforms", color: "#d4893a" },
  { key: "RESEARCH",  label: "Research",  hint: "Research groups and deep technical writing", color: "#4285f4" },
  { key: "EXPERT",    label: "Experts",   hint: "Independent practitioners and newsletters",  color: "#34d399" },
  { key: "COMMUNITY", label: "Community", hint: "dev.to, Medium and Hacker News",             color: "#08b6ae" },
]

// Topic tags produced by the ingester; anything not listed here is not shown as a filter.
export const TOPICS: { key: string; label: string }[] = [
  { key: "agents",      label: "Agents" },
  { key: "llm",         label: "LLMs" },
  { key: "rag",         label: "RAG" },
  { key: "mcp",         label: "MCP" },
  { key: "open-source", label: "Open models" },
  { key: "fine-tuning", label: "Fine-tuning" },
  { key: "prompting",   label: "Prompting" },
  { key: "mlops",       label: "MLOps" },
  { key: "vector-db",   label: "Vector DBs" },
  { key: "ai-safety",   label: "AI safety" },
  { key: "anthropic",   label: "Anthropic" },
  { key: "openai",      label: "OpenAI" },
  { key: "gemini",      label: "Gemini" },
]

const BRAND_COLORS: Record<string, string> = {
  Anthropic: "#d4893a",
  OpenAI: "#10a37f",
  "Google DeepMind": "#4285f4",
  "Google AI": "#4285f4",
  "Google Research": "#4285f4",
  "Hugging Face": "#ff9d00",
  NVIDIA: "#76b900",
  "Hacker News": "#ff6600",
}

export function tierMeta(tier?: SourceTier | null) {
  return TIERS.find(t => t.key === tier)
}

export function sourceColor(source?: string, tier?: SourceTier | null): string {
  if (source && BRAND_COLORS[source]) return BRAND_COLORS[source]
  return tierMeta(tier)?.color ?? "#6366f1"
}

export function sourceLabel(source?: string): string {
  return source ?? "Unknown"
}
