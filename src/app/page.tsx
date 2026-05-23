import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { HomeClient } from "@/components/HomeClient"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-animated">
      <Nav />
      <HomeClient />
      <Footer />
    </div>
  )
}
