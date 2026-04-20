import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-indigo to-teal text-primary-foreground hover:from-indigo/90 hover:to-teal/90 shadow-lg hover:shadow-xl',
        destructive:
          'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl',
        outline:
          'border border-indigo/30 bg-indigo/5 text-indigo hover:bg-indigo/10 hover:border-indigo/50 glass-morphism',
        secondary:
          'bg-gradient-to-r from-indigo/10 to-teal/10 text-indigo hover:from-indigo/20 hover:to-teal/20 glass-morphism border border-indigo/20',
        ghost:
          'hover:bg-indigo/5 text-indigo hover:text-indigo/80',
        link: 'text-indigo underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2 has-[>svg]:px-5',
        sm: 'h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-14 rounded-xl px-8 text-lg has-[>svg]:px-6',
        icon: 'size-11 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.3 }}
    >
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        suppressHydrationWarning
        {...props}
      />
      {(variant === 'default' || variant === 'destructive') && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.div>
  )
}

export { Button, buttonVariants }
