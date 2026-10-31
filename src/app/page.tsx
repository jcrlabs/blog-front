import { Footer } from "@/components/Footer"
import { HomeClient } from "@/components/HomeClient"

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <HomeClient />
      <Footer />
    </div>
  )
}
