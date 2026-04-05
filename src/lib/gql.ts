const API = process.env.API_INTERNAL_URL ?? process.env.API_URL ?? "https://tech-blog-api.jcrlabs.net"

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate = 300,
): Promise<T> {
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  }
  if (revalidate === 0) {
    fetchOptions.cache = "no-store"
  } else {
    fetchOptions.next = { revalidate } as NextFetchRequestConfig
  }
  const res = await fetch(`${API}/graphql`, fetchOptions)
  const { data } = await res.json()
  return data as T
}

type NextFetchRequestConfig = { revalidate?: number | false; tags?: string[] }

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
