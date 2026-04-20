"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { fetchMe, fetchUsers, type DatabaseUser } from "@/lib/auth-client"

export default function DatabasePage() {
  const router = useRouter()
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await fetchMe()
        if (!currentUser) {
          router.replace("/signin")
          return
        }

        const dbUsers = await fetchUsers()
        setUsers(dbUsers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [router])

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Database Users</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Users created through signup and stored in PostgreSQL.
        </p>

        {loading ? <p className="mt-6 text-sm">Loading users...</p> : null}
        {error ? <p className="mt-6 text-sm text-red-500">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-border/60">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr className="border-t border-border/60">
                    <td colSpan={3} className="px-4 py-4 text-muted-foreground">
                      No users found in database.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </PageTransition>
  )
}
