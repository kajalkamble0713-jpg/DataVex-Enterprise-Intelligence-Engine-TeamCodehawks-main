"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Hexagon } from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { authStorage, fetchMe, type AuthUser } from "@/lib/auth-client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/past-analyses", label: "Past Analyses" },
  { href: "/about", label: "About" },
]

const adminLinks = [
  { href: "/admin", label: "Admin" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const restore = async () => {
      const stored = authStorage.getUser()
      if (stored) {
        setUser(stored)
      }
      const me = await fetchMe()
      if (me) {
        setUser(me)
      } else if (stored) {
        authStorage.clearSession()
        setUser(null)
      }
    }
    void restore()
  }, [])

  const logout = () => {
    authStorage.clearSession()
    setUser(null)
    setMobileOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 left-0 z-50 glass-strong border-b border-indigo/20"
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group" aria-label="DataVex Prospect home">
            <motion.div 
              className="flex h-8 w-8 items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo to-teal p-1">
                <Hexagon className="h-full w-full text-white" />
              </div>
            </motion.div>
            <motion.span 
              className="text-xl font-bold tracking-tight text-foreground"
              whileHover={{ scale: 1.05 }}
            >
              Data<span className="text-gradient-cyber">Vex</span>
            </motion.span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    pathname === link.href
                      ? "text-indigo bg-indigo/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-indigo/5"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg bg-indigo/10 border border-indigo/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            {user?.role === 'admin' && adminLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    pathname === link.href
                      ? "text-indigo bg-indigo/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-indigo/5"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg bg-indigo/10 border border-indigo/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-morphism border-indigo/30 hover:bg-indigo/10"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex glass-morphism border-indigo/30 hover:bg-indigo/10"
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="magnetic-button premium-card bg-gradient-to-r from-indigo to-teal hover:from-indigo/90 hover:to-teal/90"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </motion.div>
              </>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DarkModeToggle />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="glass-morphism"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col glass-strong pt-16 md:hidden"
          >
            <nav className="flex flex-col gap-2 p-6">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-lg font-medium transition-all glass-morphism",
                        isActive
                          ? "text-indigo bg-indigo/10 border border-indigo/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-indigo/5"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute inset-0 rounded-xl bg-indigo/10 border border-indigo/30"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
              {user?.role === 'admin' && adminLinks.map((link, i) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + i) * 0.05 + 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-lg font-medium transition-all glass-morphism",
                        isActive
                          ? "text-indigo bg-indigo/10 border border-indigo/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-indigo/5"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute inset-0 rounded-xl bg-indigo/10 border border-indigo/30"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex flex-col gap-3 pt-4"
              >
                {user ? (
                  <Button
                    variant="outline"
                    className="glass-morphism border-indigo/30 hover:bg-indigo/10"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="glass-morphism border-indigo/30 hover:bg-indigo/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="magnetic-button premium-card bg-gradient-to-r from-indigo to-teal"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
