const API = process.env.API_URL ?? "https://tech-blog-api.jcrlabs.net"

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 300,
): Promise<T> {
  const res = await fetch(`${API}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  })
  const { data } = await res.json()
  return data as T
}
