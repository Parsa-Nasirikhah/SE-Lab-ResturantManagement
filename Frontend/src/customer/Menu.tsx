import { useState } from "react"
import { DashboardLayout } from "../dashboard/DashboardLayout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { UtensilsCrossed, ShoppingBag } from "lucide-react"

const CustomerMenu = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState("all")

  if (!user) return null

  const navigationItems = [
    {
      label: "My Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/customer"),
    },
    {
      label: "Menu",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      active: true,
    }
  ]

  const categories = ["all", "starter", "main", "drink", "dessert"]

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Menu</h1>

        <div className="flex gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg ${
                category === c
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-white p-4 rounded-xl border">
              <h3 className="font-bold">Menu Item {id}</h3>
              <button
                onClick={() =>
                  navigate(`/dashboard/customer/menu/${id}`)
                }
                className="text-emerald-600 text-sm mt-2"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CustomerMenu
