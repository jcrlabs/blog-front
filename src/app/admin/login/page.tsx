"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { gqlAuth } from "@/lib/gql"
import { LOGIN } from "@/lib/queries"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await gqlAuth<{ login: { accessToken: string } }>(
        LOGIN,
        "",
        { input: { email, password } },
      )
      localStorage.setItem("admin_token", data.login.accessToken)
      router.push("/admin")
    } catch {
      setError("Credenciales inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 border border-white/10 p-8 rounded"
      >
        <h1 className="text-lg font-bold tracking-widest uppercase text-white/80">
          Admin
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black text-sm font-bold py-2 rounded disabled:opacity-40"
        >
          {loading ? "..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}
