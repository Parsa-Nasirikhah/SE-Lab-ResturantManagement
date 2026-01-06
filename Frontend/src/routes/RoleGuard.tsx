import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type Props = {
  allowedRoles: string[]
}

const RoleGuard = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Navigate to="/loginpage" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleGuard
