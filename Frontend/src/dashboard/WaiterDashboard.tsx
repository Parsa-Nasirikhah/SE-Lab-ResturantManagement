import { Users, CheckCircle, Clock, Package } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReadyOrders, markOrderAsServed } from "../api/waiter";

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
  note?: string;
};

type Order = {
  order_id: string;
  table: { number: number } | null;
  status: string;
  created_at: string;
  items: OrderItem[];
};

const isToday = (isoDate: string) => {
  const d = new Date(isoDate);
  const now = new Date();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const WaiterDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  // const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Service Dashboard",
      icon: <Users className="w-5 h-5" />,
      active: true,
    },
    // {
    //   label: "Served Today",
    //   icon: <CheckCircle className="w-5 h-5" />,
    //   onClick: () => navigate("/dashboard/waiter/serve"),
    // },
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [servedTodayCount, setServedTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const data = await getReadyOrders();
    const allOrders: Order[] = Array.isArray(data) ? data : [];

    const ready = allOrders.filter((o) => o.status === "READY");
    setOrders(ready);

    const servedToday = allOrders.filter(
      (o) => o.status === "SERVED" && isToday(o.created_at)
    );
    setServedTodayCount(servedToday.length);
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

  const handleMarkAsServed = async (orderId: string) => {
    await markOrderAsServed(orderId);
    await loadOrders();
  };

  const readyOrders = orders.map((order) => ({
    id: order.order_id,
    table: `Table ${order.table?.number ?? "-"}`,
    items: order.items.map(
      (i) => `${i.menu_item_detail?.name ?? "Item"} × ${i.quantity}`
    ),
    itemCount: order.items.length,
    time: "Just now",
    urgent: false,
  }));

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-slate-900 mb-2">
            Service Dashboard
          </h1>
          <p className="text-slate-600">
            Manage orders that are ready to be served
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 rounded-lg p-2">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-slate-600">Ready to Serve</span>
            </div>
            <p className="font-bold text-3xl text-slate-900">
              {readyOrders.length}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 rounded-lg p-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-slate-600">Served Today</span>
            </div>
            <p className="font-bold text-3xl text-slate-900">
              {servedTodayCount}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 rounded-lg p-2">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-slate-600">Urgent</span>
            </div>
            <p className="font-bold text-3xl text-slate-900">0</p>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-bold text-xl text-slate-900 mb-4">
            Orders Ready to Serve
          </h2>

          {loading && (
            <p className="text-slate-500">Loading orders...</p>
          )}

          {!loading && readyOrders.length === 0 && (
            <div className="bg-white border rounded-xl p-8 text-center text-slate-600">
              No orders ready to serve 🍽️
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-all border-slate-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {order.id}
                    </h3>
                    <p className="text-slate-600 font-medium">
                      {order.table}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{order.time}</p>
                  </div>
                </div>

                <div className="mb-4 bg-slate-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Items ({order.itemCount}):
                  </p>
                  <ul className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-slate-900 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleMarkAsServed(order.id)}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Served
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WaiterDashboard;
