"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { setUserSession } from "@/lib/session"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Use session cookie instead of localStorage
        setUserSession(data.user)
        router.push("/chat")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">QuickChat</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue messaging</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-foreground text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-foreground placeholder:text-muted-foreground"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-foreground text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-foreground placeholder:text-muted-foreground"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
