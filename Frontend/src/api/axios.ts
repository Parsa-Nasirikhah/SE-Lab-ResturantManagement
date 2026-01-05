import axios from "axios"

// NOTE: Keep this instance as the single source of truth for attaching tokens
// and refreshing access tokens.

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const url = config.url || ""

  // Don't attach potentially stale tokens to auth endpoints.
  const isAuthEndpoint =
    url.includes("/auth/token/") ||
    url.includes("/auth/token/refresh/") ||
    url.includes("/auth/register")

  if (!isAuthEndpoint) {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []

function pushToQueue(cb: (token: string | null) => void) {
  refreshQueue.push(cb)
}

function flushQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    const status = error?.response?.status

    // If we got a 401 and this request hasn't been retried yet, try refresh once.
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refresh = localStorage.getItem("refreshToken")
      if (!refresh) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pushToQueue((token) => {
            if (!token) return reject(error)
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // IMPORTANT: use a plain axios call here so we don't recurse interceptors
        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          { refresh },
          { headers: { "Content-Type": "application/json" } }
        )

        const newAccess = res.data?.access
        if (!newAccess) throw new Error("No access token in refresh response")

        localStorage.setItem("accessToken", newAccess)
        flushQueue(newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (e) {
        // Refresh failed: clear tokens
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        flushQueue(null)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
