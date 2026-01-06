import type { ReactNode } from "react";
import { UtensilsCrossed, LogOut, ChevronRight } from "lucide-react";
import type { User } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
  navigationItems: Array<{
    label: string;
    icon: ReactNode;
    active?: boolean;
    onClick?: () => void;
  }>;
}

export function DashboardLayout({
  children,
  user,
  navigationItems,
}: DashboardLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Customer":
        return "bg-blue-100 text-blue-700";
      case "Chef":
        return "bg-orange-100 text-orange-700";
      case "Waiter":
        return "bg-purple-100 text-purple-700";
      case "Manager":
        return "bg-emerald-100 text-emerald-700";
      case "Admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-[99vw] bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-emerald-600 rounded-lg p-2">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                ServeSmart
              </h2>
              <p className="text-xs text-slate-600">
                Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.active && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {user.username}
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
