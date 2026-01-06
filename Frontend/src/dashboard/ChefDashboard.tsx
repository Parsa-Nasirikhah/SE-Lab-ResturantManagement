import { ChefHat, CheckCircle, Clock } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getChefOrders, updateOrderStatus } from "../api/chef";

type OrderItem = {
  menu_item: string; // UUID
  menu_item_detail?: {
    item_id: string;
    name: string;
    description: string;
    price: string;
    available: boolean;
  };
  quantity: number;
  note: string;
};


type Order = {
  order_id: string;
  table: { number: number } | null;
  status: "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED" | "PAID";
  created_at: string;
  items: OrderItem[];
};

const ChefDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const navigationItems = [
    {
      label: "Kitchen Dashboard",
      icon: <ChefHat className="w-5 h-5" />,
      active: true,
    },
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    const data = await getChefOrders();

    const filtered: Order[] = Array.isArray(data)
      ? data.filter((o) => o.status === "PENDING" || o.status === "PREPARING")
      : [];

    setOrders(filtered);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (mounted) await loadOrders();
      } catch (e) {
        console.error("Failed to load chef orders:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const startPreparing = async (orderId: string) => {
    // ✅ Optimistic update (UI فوری تغییر می‌کند)
    const prev = orders;
    setUpdatingId(orderId);
    setOrders((cur) =>
      cur.map((o) => (o.order_id === orderId ? { ...o, status: "PREPARING" } : o))
    );

    try {
      await updateOrderStatus(orderId, "PREPARING");
    } catch (e) {
      // 🔁 rollback
      console.error("Start preparing failed:", e);
      setOrders(prev);
      return;
    } finally {
      setUpdatingId(null);
      // ✅ sync با سرور
      try {
        await loadOrders();
      } catch (e) {
        console.error("Reload after start preparing failed:", e);
      }
    }
  };

  const markAsReady = async (orderId: string) => {
    // ✅ Optimistic update (UI فوری: سفارش از لیست Chef حذف می‌شود)
    const prev = orders;
    setUpdatingId(orderId);
    setOrders((cur) => cur.filter((o) => o.order_id !== orderId));

    try {
      await updateOrderStatus(orderId, "READY");
    } catch (e) {
      // 🔁 rollback
      console.error("Mark as ready failed:", e);
      setOrders(prev);
      return;
    } finally {
      setUpdatingId(null);
      // ✅ sync با سرور
      try {
        await loadOrders();
      } catch (e) {
        console.error("Reload after mark ready failed:", e);
      }
    }
  };

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8 text-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-2">Kitchen Dashboard</h1>
          <p className="text-slate-600">Manage kitchen orders</p>
        </div>

        {loading && <p className="text-slate-500">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
            No orders to prepare right now 🍽️
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-xl border p-6 shadow-sm"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{order.order_id}</h3>
                  <p className="text-slate-600">
                    Table {order.table?.number ?? "-"}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium ${
                    order.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
  {order.items.map((item, idx) => (
    <div
      key={idx}
      className="bg-slate-50 rounded-lg p-3"
    >
      <div className="flex justify-between">
        <span className="font-medium">
  {item.menu_item_detail?.name ?? "Item"}
</span>
        <span>x{item.quantity}</span>
      </div>

      {item.note && (
        <p className="text-sm text-orange-600">
          <strong>Note:</strong> {item.note}
        </p>
      )}
    </div>
  ))}
</div>

              {order.status === "PENDING" && (
                <button
                  onClick={() => startPreparing(order.order_id)}
                  disabled={updatingId === order.order_id}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Clock className="w-5 h-5" />
                  Start Preparing
                </button>
              )}

              {order.status === "PREPARING" && (
                <button
                  onClick={() => markAsReady(order.order_id)}
                  disabled={updatingId === order.order_id}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Ready
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChefDashboard;
