"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authStorage, fetchMe, getBackendBaseUrl } from "@/lib/auth-client"
import { Shield, User } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "employee">("employee")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const check = async () => {
      const user = await fetchMe()
      if (user) {
        router.replace("/")
      }
    }
    void check()
  }, [router])

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-border/50 bg-background/70 p-8 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with DataVex Prospect Intelligence Engine.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("employee")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                role === "employee"
                  ? "border-indigo bg-indigo/10"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <User className="h-8 w-8" />
              <span className="font-semibold">Employee</span>
              <span className="text-xs text-muted-foreground">Standard access</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                role === "admin"
                  ? "border-indigo bg-indigo/10"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <Shield className="h-8 w-8" />
              <span className="font-semibold">Admin</span>
              <span className="text-xs text-muted-foreground">Full access</span>
            </button>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setBusy(true)
              setError("")
              setMessage("")
              try {
                const response = await fetch(`${getBackendBaseUrl()}/api/auth/signup`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ name, email, password, role })
                })

                const data = await response.json()
                if (!response.ok) {
                  throw new Error(data.message || "Signup failed")
                }

                authStorage.setSession(data.token, data.user)
                setMessage("Successfully signed up")
                router.push("/")
              } catch (err) {
                setError(err instanceof Error ? err.message : "Signup failed")
              } finally {
                setBusy(false)
              }
            }}
          >
            <Input required type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input required type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input required type="password" placeholder="Password (min 8 characters)" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="w-full" disabled={busy}>
              Create account
            </Button>
          </form>

          {message ? <p className="mt-4 text-sm text-emerald-500">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
