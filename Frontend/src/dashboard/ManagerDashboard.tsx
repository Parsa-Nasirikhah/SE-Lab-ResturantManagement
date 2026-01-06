import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

type OrderItem = {
  quantity: number;
  menu_item_detail?: {
    name: string;
  };
};

type Order = {
  order_id: string;
  table: { number: number } | null;
  status: string;
  created_at: string;
  total_price: number;
  items?: OrderItem[];
};

const formatStatus = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "SERVED":
      return "Served";
    case "PAID":
      return "Paid";
    default:
      return status;
  }
};

const timeAgo = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;

  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const formatDay = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const ManagerDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const navigationItems = [
    {
      label: "Overview",
      icon: <TrendingUp className="w-5 h-5" />,
      active: true,
    },
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const res = await api.get("/orders/");
    const data: Order[] = Array.isArray(res.data) ? res.data : [];
    setOrders(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadOrders();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { revenue, orderCount, avgOrder } = useMemo(() => {
    const paidOrServed = orders.filter(
      (o) => o.status === "PAID" || o.status === "SERVED"
    );

    const revenue = paidOrServed.reduce(
      (sum, o) => sum + (o.total_price ?? 0),
      0
    );

    const orderCount = orders.length;
    const avgOrder =
      orderCount > 0 ? revenue / orderCount : 0;

    return { revenue, orderCount, avgOrder };
  }, [orders]);

  const revenueChartData = useMemo(() => {
    const today = new Date();
    const daysMap: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      daysMap[formatDay(d)] = 0;
    }

    orders.forEach((order) => {
      if (order.status !== "PAID" && order.status !== "SERVED") return;

      const d = new Date(order.created_at);
      const label = formatDay(d);

      if (label in daysMap) {
        daysMap[label] += order.total_price ?? 0;
      }
    });

    return Object.entries(daysMap).map(([day, revenue]) => ({
      day,
      revenue,
    }));
  }, [orders]);

  const topSellingItems = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((order) => {
      if (order.status !== "PAID" && order.status !== "SERVED") return;

      order.items?.forEach((item) => {
        const name = item.menu_item_detail?.name ?? "Item";
        map[name] = (map[name] || 0) + item.quantity;
      });
    });

    return Object.entries(map)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 10);
  }, [orders]);

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8 text-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-2">
            Manager Dashboard
          </h1>
          <p className="text-slate-600">
            Overview of system performance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-slate-600">Revenue</span>
            </div>
            <p className="font-bold text-3xl">
              ${revenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="text-slate-600">Orders</span>
            </div>
            <p className="font-bold text-3xl">
              {orderCount}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-slate-600">
                Avg Order Value
              </span>
            </div>
            <p className="font-bold text-3xl">
              ${avgOrder.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Revenue + Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Revenue Chart */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4">
              Revenue (Last 7 Days)
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4">
              Top Selling Items
            </h2>

            {topSellingItems.length === 0 && (
              <p className="text-slate-500">
                No sales data available
              </p>
            )}

            <div className="space-y-3">
              {topSellingItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-700 font-medium">
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="font-bold text-xl mb-4">
            Recent Orders
          </h2>

          <div className="bg-white rounded-xl border overflow-hidden">
            {loading && (
              <p className="p-6 text-slate-500">
                Loading orders...
              </p>
            )}

            {!loading &&
              recentOrders.map((order, idx) => (
                <div
                  key={order.order_id}
                  className={`p-6 flex items-center justify-between ${
                    idx !== recentOrders.length - 1
                      ? "border-b"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {order.order_id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Table{" "}
                      {order.table?.number ?? "-"} ·{" "}
                      {timeAgo(order.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900 mb-1">
                      ${order.total_price?.toFixed(2) ?? "0.00"}
                    </p>
                    <span className="text-xs font-medium text-slate-600">
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))}

            {!loading && recentOrders.length === 0 && (
              <p className="p-6 text-slate-500">
                No recent orders
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
