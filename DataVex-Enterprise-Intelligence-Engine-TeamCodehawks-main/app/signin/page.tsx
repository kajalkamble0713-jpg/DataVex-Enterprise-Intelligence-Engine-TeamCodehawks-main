"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authStorage, fetchMe, getBackendBaseUrl } from "@/lib/auth-client"

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
          <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your DataVex workspace.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setBusy(true)
              setError("")
              setMessage("")
              try {
                const response = await fetch(`${getBackendBaseUrl()}/api/auth/signin`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ email, password })
                })

                const data = await response.json()
                if (!response.ok) {
                  throw new Error(data.message || "Sign-in failed")
                }

                authStorage.setSession(data.token, data.user)
                setMessage("Successfully signed in")
                router.push("/")
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign-in failed")
              } finally {
                setBusy(false)
              }
            }}
          >
            <Input required type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="w-full" disabled={busy}>
              Sign in
            </Button>
          </form>

          {message ? <p className="mt-4 text-sm text-emerald-500">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <p className="mt-6 text-sm text-muted-foreground">
            New to DataVex?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
