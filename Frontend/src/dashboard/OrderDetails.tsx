import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getOrderDetail } from "../api/restaurant";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrderDetail(orderId!);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <DashboardLayout user={user} navigationItems={[]}>
        <div className="p-8 text-slate-600">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout user={user} navigationItems={[]}>
        <div className="p-8 text-slate-600">Order not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} navigationItems={[]}>
      <div className="p-8 max-w-3xl text-slate-900">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Order Details
        </h1>
        <p className="text-slate-600 mb-6">
          Order ID: {order.order_id}
        </p>

        {/* Info */}
        <div className="bg-white border rounded-xl p-6 mb-6">
          <p className="text-slate-900">
            <b>Status:</b>{" "}
            <span className="text-slate-700">{order.status}</span>
          </p>
          <p className="text-slate-900 mt-2">
            <b>Created:</b>{" "}
            <span className="text-slate-700">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </p>
        </div>

        {/* Items */}
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 text-slate-900">
            Items
          </h2>

          <ul className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <li
                key={idx}
                className="flex justify-between text-slate-700"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="flex justify-end text-xl font-bold text-slate-900">
          Total: ${order.total_price}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
