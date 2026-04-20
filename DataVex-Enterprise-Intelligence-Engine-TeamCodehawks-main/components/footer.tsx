"use client"

import Link from "next/link"
import { Hexagon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 lg:px-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Hexagon className="h-5 w-5 text-primary fill-primary/10" />
          <span className="text-sm font-semibold text-foreground">
            Data<span className="text-gradient">Vex</span>
          </span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="text-xs text-muted-foreground">
            Prospect Intelligence Engine
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            About
          </Link>
          <span className="cursor-default">Privacy</span>
          <span className="cursor-default">Terms</span>
          <span>
            &copy; {new Date().getFullYear()} DataVex
          </span>
        </div>
      </div>
    </footer>
  )
}
