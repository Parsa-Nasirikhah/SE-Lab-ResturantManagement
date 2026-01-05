import { Routes, Route } from "react-router-dom"

import HomePage from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Unauthorized from "./pages/Unauthorized"

import AdminDashboard from "../dashboard/AdminDashboard"
import ChefDashboard from "../dashboard/ChefDashboard"
import CustomerDashboard from "../dashboard/CustomerDashboard"
import WaiterDashboard from "../dashboard/WaiterDashboard"
import ManagerDashboard from "../dashboard/ManagerDashboard"
import OrderDetails from "../dashboard/OrderDetails"


import ProtectedRoute from "../routes/ProtectedRoute"
import RoleGuard from "../routes/RoleGuard"

import MenuPage from "../menu/MenuPage"
import SystemSettings from "../admin/SystemSettings"
import ServeTodayDashboard from "../waiter/ServeTodayDashboard"

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/loginpage" element={<Login />} />
      <Route path="/registerpage" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/systemsettings" element={<SystemSettings />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={["chef"]} />}>
          <Route path="/dashboard/chef" element={<ChefDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={["customer"]} />}>
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/customer/menu" element={<MenuPage />} />
          <Route path="/dashboard/customer/orders/:orderId" element={<OrderDetails />}
/>

        </Route>

        <Route element={<RoleGuard allowedRoles={["waiter"]} />}>
          <Route path="/dashboard/waiter" element={<WaiterDashboard />} />
          <Route path="/dashboard/waiter/serve" element={<ServeTodayDashboard />} />
        </Route>

        <Route element={<RoleGuard allowedRoles={["manager"]} />}>
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
