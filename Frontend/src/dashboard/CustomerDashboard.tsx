import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { listMyOrders, cancelOrder } from "../api/restaurant";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navigationItems = [
    {
      label: "My Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      active: true,
    },
    {
      label: "Menu",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/customer/menu"),
    },
  ];

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load Orders ---------------- */

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await listMyOrders();
        if (mounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- Helpers ---------------- */

  const formatStatus = (status: string) => {
    const pretty = status?.toLowerCase?.() || "";
    return pretty
      ? pretty.charAt(0).toUpperCase() + pretty.slice(1)
      : "Pending";
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  /* ---------------- Cancel Order ---------------- */

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderId);

      // آپدیت آنی UI بدون refresh
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId
            ? { ...o, status: "CANCELLED" }
            : o
        )
      );
    } catch {
      alert("Failed to cancel order");
    }
  };

  /* ---------------- Derived Data ---------------- */

  const { activeOrders, orderHistory } = useMemo(() => {
    const activeStatuses = new Set(["PENDING", "PREPARING"]);
    const historyStatuses = new Set([
      "READY",
      "SERVED",
      "CANCELLED",
      "PAID",
    ]);

    const mapped = orders.map((o: any) => ({
      id: o.order_id,
      rawStatus: o.status,
      items: Array.isArray(o.items)
        ? o.items.map(
            (it: any) =>
              it?.menu_item_detail?.name ??
              it?.menu_item?.name ??
              "Item"
          )
        : [],
      total:
        typeof o.total_price === "string"
          ? parseFloat(o.total_price)
          : o.total_price ?? 0,
      status: formatStatus(o.status),
      date: o.created_at ? formatDate(o.created_at) : "",
    }));

    return {
      activeOrders: mapped.filter((o) =>
        activeStatuses.has(o.rawStatus)
      ),
      orderHistory: mapped.filter((o) =>
        historyStatuses.has(o.rawStatus)
      ),
    };
  }, [orders]);

  /* ---------------- Status UI ---------------- */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Ready":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8 text-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-2">
            My Orders
          </h1>
          <p className="text-slate-600">
            Track your active orders and view order history
          </p>
        </div>

        {/* Active Orders */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">
              Active Orders
            </h2>
            <button
              onClick={() =>
                navigate("/dashboard/customer/menu")
              }
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Go to Menu
            </button>
          </div>

          {activeOrders.length === 0 && (
            <div className="bg-white border rounded-xl p-6 text-slate-600">
              No active orders
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border p-6 shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {order.id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Active Order
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <ul className="mb-4 space-y-1">
                  {order.items.map(
                    (item: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-700"
                      >
                        • {item}
                      </li>
                    )
                  )}
                </ul>

                <div className="flex items-center justify-between border-t pt-4">
                  <p className="font-bold text-slate-900">
                    ${order.total.toFixed(2)}
                  </p>

                  {/* Cancel Button */}
                  <button
                    onClick={() =>
                      handleCancelOrder(order.id)
                    }
                    className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="font-bold text-xl mb-4">
            Order History
          </h2>

          <div className="bg-white rounded-xl border">
            {loading && (
              <p className="p-6 text-slate-500">
                Loading orders...
              </p>
            )}

            {!loading &&
              orderHistory.map((order, idx) => (
                <div
                  key={order.id}
                  className={`p-6 flex justify-between ${
                    idx !== orderHistory.length - 1
                      ? "border-b"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {order.id}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {order.items.join(", ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
