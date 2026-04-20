"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ArrowUpDown,
  Calendar,
  Globe,
  FileSearch,
  ArrowRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GlassCard } from "@/components/glass-card"
import { VerdictBadge } from "@/components/verdict-badge"
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/page-transition"
import { mockAnalyses } from "@/lib/mock-data"

type SortOption = "date-desc" | "date-asc" | "name" | "verdict"

export default function PastAnalysesPage() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("date-desc")
  const [verdictFilter, setVerdictFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    let results = [...mockAnalyses]

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.domain.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q)
      )
    }

    if (verdictFilter !== "all") {
      results = results.filter((a) => a.verdict === verdictFilter)
    }

    switch (sort) {
      case "date-desc":
        results.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        break
      case "date-asc":
        results.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        break
      case "name":
        results.sort((a, b) => a.companyName.localeCompare(b.companyName))
        break
      case "verdict":
        results.sort((a, b) => a.verdict.localeCompare(b.verdict))
        break
    }

    return results
  }, [search, sort, verdictFilter])

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Past{" "}
              <span className="text-gradient">Analyses</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse and search your analysis history.
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters sidebar */}
          <FadeIn delay={0.1} className="w-full lg:w-64 shrink-0">
            <GlassCard hover={false} className="sticky top-24">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Filters
              </h3>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    aria-label="Search analyses"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Sort By
                  </label>
                  <Select
                    value={sort}
                    onValueChange={(v) => setSort(v as SortOption)}
                  >
                    <SelectTrigger className="w-full">
                      <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="verdict">Verdict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Verdict
                  </label>
                  <Select
                    value={verdictFilter}
                    onValueChange={setVerdictFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verdicts</SelectItem>
                      <SelectItem value="pursue">Pursue</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </FadeIn>

          {/* Results grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <FileSearch className="mb-4 h-12 w-12 text-muted-foreground/40" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No analyses found
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                  <Link href="/">
                    <Button className="gap-2">
                      Run New Analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <StaggerContainer
                  key="grid"
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filtered.map((analysis) => (
                    <StaggerItem key={analysis.id}>
                      <Link href={`/results/${analysis.id}`}>
                        <GlassCard className="flex h-full flex-col gap-3 transition-all hover:border-primary/30">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="truncate text-base font-semibold text-foreground">
                                {analysis.companyName}
                              </h3>
                              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                {analysis.domain}
                              </p>
                            </div>
                            <VerdictBadge
                              verdict={analysis.verdict}
                              size="sm"
                              animate={false}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {analysis.summary}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(analysis.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {analysis.confidenceScore}% confidence
                            </span>
                          </div>
                        </GlassCard>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
