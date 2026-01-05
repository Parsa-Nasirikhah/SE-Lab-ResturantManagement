import { X } from "lucide-react";
import { useState } from "react";
import { updateStaffRole } from "../api/admin";

type Props = {
  userId: number;
  currentRole: string;
  onClose: () => void;
  onUpdated: () => void;
};

const EditStaffModal = ({
  userId,
  currentRole,
  onClose,
  onUpdated,
}: Props) => {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateStaffRole(userId, role);
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900">
            Edit Staff Role
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <select
          className="w-full border rounded-lg px-3 py-2 mb-6"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="chef">Chef</option>
          <option value="waiter">Waiter</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
