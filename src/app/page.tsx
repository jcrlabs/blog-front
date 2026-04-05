import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { PostGrid } from "@/components/PostGrid"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero postCount={0} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <PostGrid />
      </main>
      <Footer />
    </div>
  )
}
