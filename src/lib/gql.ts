const API = process.env.API_URL ?? "https://tech-blog-api.jcrlabs.net"

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 300,
): Promise<T> {
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  })
  const { data } = await res.json()
  return data as T
}

export async function gqlAuth<T>(
  query: string,
  token: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}
