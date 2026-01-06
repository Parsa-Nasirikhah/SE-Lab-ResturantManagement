import {
  Shield,
  Settings,
  UserPlus,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStaffList } from "../api/admin";
import CreateStaffModal from "./CreateStaffModal";
import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";

type StaffUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Dashboard",
      icon: <Shield className="w-5 h-5" />,
      active: true,
    },
    {
      label: "System Settings",
      icon: <Settings className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/admin/systemsettings"),
    },
  ];

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<StaffUser | null>(null);

  const refreshStaff = async () => {
    const data = await getStaffList();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshStaff();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "chef":
        return "bg-orange-100 text-orange-700";
      case "waiter":
        return "bg-purple-100 text-purple-700";
      case "manager":
        return "bg-emerald-100 text-emerald-700";
      case "admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8 text-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600">
            Manage users and system configuration
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <span className="text-slate-600">Total Staff</span>
            <p className="font-bold text-3xl">
              {users.length}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <span className="text-slate-600">Chefs</span>
            <p className="font-bold text-3xl">
              {users.filter(u => u.role === "chef").length}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <span className="text-slate-600">Waiters</span>
            <p className="font-bold text-3xl">
              {users.filter(u => u.role === "waiter").length}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <span className="text-slate-600">Managers</span>
            <p className="font-bold text-3xl">
              {users.filter(u => u.role === "manager").length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Create Staff Account
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="font-bold text-lg">
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-slate-700">Username</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-700">Email</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-700">Role</th>
                  <th className="text-left px-6 py-3 text-sm text-slate-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  users.map((userItem, index) => (
                    <tr
                      key={userItem.id}
                      className={`hover:bg-slate-50 ${
                        index !== users.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {userItem.username}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {userItem.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            userItem.role
                          )}`}
                        >
                          {userItem.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(userItem)}
                            className="px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          >
                            Change Role
                          </button>

                          <button
                            onClick={() => setDeletingUser(userItem)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete User
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                      Loading staff...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateStaffModal
          onClose={() => setShowCreateModal(false)}
          onCreated={refreshStaff}
        />
      )}

      {editingUser && (
        <EditStaffModal
          userId={editingUser.id}
          currentRole={editingUser.role}
          onClose={() => setEditingUser(null)}
          onUpdated={refreshStaff}
        />
      )}

      {deletingUser && (
        <DeleteStaffModal
          userId={deletingUser.id}
          username={deletingUser.username}
          onClose={() => setDeletingUser(null)}
          onDeleted={refreshStaff}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
