import * as React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-11 w-full min-w-0 rounded-xl border border-indigo/20 bg-indigo/5 px-4 py-2 text-base shadow-lg transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm glass-morphism focus:border-indigo/50 focus:ring-2 focus:ring-indigo/20 focus:bg-indigo/10',
          className,
        )}
        suppressHydrationWarning
        {...props}
      />
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-indigo/50 opacity-0 pointer-events-none"
        whileFocus={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}

export { Input }
