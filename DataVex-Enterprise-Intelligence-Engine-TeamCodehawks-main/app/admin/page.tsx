"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"
import { authStorage, fetchMe, fetchUsers, createEmployee, deleteEmployee, type DatabaseUser } from "@/lib/auth-client"
import { Plus, Trash2, Users, Shield } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [employees, setEmployees] = useState<DatabaseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form fields
  const [employeeId, setEmployeeId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const check = async () => {
      const currentUser = await fetchMe()
      if (!currentUser) {
        router.replace("/signin")
        return
      }
      if (currentUser.role !== "admin") {
        router.replace("/")
        return
      }
      setUser(currentUser)
      await loadEmployees()
      setLoading(false)
    }
    void check()
  }, [router])

  const loadEmployees = async () => {
    try {
      const users = await fetchUsers()
      setEmployees(users)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees")
    }
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    setSuccess("")

    try {
      await createEmployee({ employeeId, name, email, password })
      setSuccess("Employee created successfully")
      setEmployeeId("")
      setName("")
      setEmail("")
      setPassword("")
      setShowForm(false)
      await loadEmployees()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee")
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteEmployee = async (id: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to delete ${employeeName}?`)) {
      return
    }

    setBusy(true)
    setError("")
    setSuccess("")

    try {
      await deleteEmployee(id)
      setSuccess("Employee deleted successfully")
      await loadEmployees()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete employee")
    } finally {
      setBusy(false)
    }
  }

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
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage employee accounts and access
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-500">{success}</p>
          </div>
        )}

        {showForm && (
          <GlassCard hover={false} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Create New Employee</h2>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Employee ID
                </label>
                <Input
                  required
                  type="text"
                  placeholder="EMP001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  required
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  required
                  type="password"
                  placeholder="Min 8 characters"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={busy}>
                  Create Employee
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo" />
            <h2 className="text-xl font-semibold text-foreground">
              All Users ({employees.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Employee ID
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Role
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-border/30">
                    <td className="py-3 text-sm text-muted-foreground">
                      {emp.employeeId || "-"}
                    </td>
                    <td className="py-3 text-sm font-medium text-foreground">
                      {emp.name}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {emp.email}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {emp.role === "admin" ? (
                          <>
                            <Shield className="h-4 w-4 text-indigo" />
                            <span className="text-sm font-medium text-indigo">Admin</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Employee</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          emp.isActive
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {emp.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      {emp.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          disabled={busy}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  )
}
