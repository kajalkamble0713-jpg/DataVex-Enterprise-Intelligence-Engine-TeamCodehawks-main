"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
