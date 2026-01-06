import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  UtensilsCrossed,
  Loader2,
  AlertCircle,
} from "lucide-react"

import { login, getMe } from "../../api/auth"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const tokens = await login({ username, password })
      localStorage.setItem("accessToken", tokens.access)
      localStorage.setItem("refreshToken", tokens.refresh)

      const me = await getMe()
      setUser(me) 

      navigate(`/dashboard/${me.role}`, { replace: true })

    } catch (err: any) {
      console.error("Login failed:", err)

      if (err?.response?.status === 401) {
        setError("Invalid username or password")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-[99vw] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left side */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-12 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white rounded-xl p-3">
                <UtensilsCrossed className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-bold text-2xl">ServeSmart</h2>
                <p className="text-emerald-100 text-sm">Management System</p>
              </div>
            </div>

            <h3 className="font-bold text-3xl mb-4">
              Streamline Your Restaurant Operations
            </h3>

            <p className="text-emerald-50 text-lg leading-relaxed">
              Access your role-based dashboard and manage your daily workflow.
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">

            <h1 className="font-bold text-3xl text-slate-900 mb-6">
              Sign in to your account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            © 2025 Restaurant Management System
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
