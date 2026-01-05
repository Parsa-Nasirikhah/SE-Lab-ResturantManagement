import { X } from "lucide-react";
import { disableStaff } from "../api/admin";
import { useState } from "react";

type Props = {
  userId: number;
  username: string;
  onClose: () => void;
  onDeleted: () => void;
};

const DeleteStaffModal = ({
  userId,
  username,
  onClose,
  onDeleted,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await disableStaff(userId);
      onDeleted();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded-xl p-6 shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900">
            Disable Staff
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <p className="text-slate-600 mb-6">
          Are you sure you want to disable{" "}
          <span className="font-medium text-slate-900">
            {username}
          </span>
          ?  
          <br />
          This user will no longer be able to log in.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Disabling..." : "Disable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
