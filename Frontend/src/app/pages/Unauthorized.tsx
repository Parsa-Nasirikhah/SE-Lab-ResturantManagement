import { Link } from "react-router-dom"

const Unauthorized = () => {
  return (
    <div className="min-h-screen w-[99vw] flex flex-col items-center justify-center bg-slate-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>

      <p className="text-slate-600 mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        to="/loginpage"
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
      >
        Back to Login
      </Link>
    </div>
  )
}

export default Unauthorized
