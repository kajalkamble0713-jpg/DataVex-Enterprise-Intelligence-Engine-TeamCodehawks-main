"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatedHero } from "@/components/animated-hero"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksTeaser } from "@/components/how-it-works-teaser"
import { StatsBar } from "@/components/stats-bar"
import { PageTransition } from "@/components/page-transition"
import { fetchMe } from "@/lib/auth-client"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await fetchMe()
      if (!user) {
        router.replace("/signin")
      } else {
        setLoading(false)
      }
    }
    void checkAuth()
  }, [router])

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <AnimatedHero />
      <FeaturesSection />
      <StatsBar />
      <HowItWorksTeaser />
    </PageTransition>
  )
}

