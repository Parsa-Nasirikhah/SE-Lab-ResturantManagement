import { useState } from 'react';
import { useAuth } from "../context/AuthContext"
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { useNavigate } from "react-router-dom"


import {
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ChefHat,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  Check,
  Loader
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  tableNumber: string;
  status: 'preparing' | 'ready' | 'served';
  timeSinceOrder: number; // minutes
  items: OrderItem[];
  isUrgent: boolean;
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ServeTodayDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      tableNumber: 'Table 5',
      status: 'ready',
      timeSinceOrder: 8,
      items: [
        { id: '1', name: 'Grilled Salmon', quantity: 2 },
        { id: '2', name: 'Caesar Salad', quantity: 1 },
        { id: '3', name: 'Fresh Lemonade', quantity: 2 }
      ],
      isUrgent: false
    },
    {
      id: 'ORD-002',
      tableNumber: 'Table 12',
      status: 'ready',
      timeSinceOrder: 15,
      items: [
        { id: '4', name: 'Ribeye Steak', quantity: 1, notes: 'Medium rare' },
        { id: '5', name: 'Pasta Carbonara', quantity: 1 },
        { id: '6', name: 'Red Wine', quantity: 2 }
      ],
      isUrgent: true
    },
    {
      id: 'ORD-003',
      tableNumber: 'Table 3',
      status: 'preparing',
      timeSinceOrder: 5,
      items: [
        { id: '7', name: 'Margherita Pizza', quantity: 2 },
        { id: '8', name: 'Tropical Cocktail', quantity: 3 }
      ],
      isUrgent: false
    },
    {
      id: 'ORD-004',
      tableNumber: 'Table 8',
      status: 'preparing',
      timeSinceOrder: 12,
      items: [
        { id: '9', name: 'Chocolate Lava Cake', quantity: 1 },
        { id: '10', name: 'Cappuccino', quantity: 2 }
      ],
      isUrgent: false
    },
    {
      id: 'ORD-005',
      tableNumber: 'Table 15',
      status: 'served',
      timeSinceOrder: 45,
      items: [
        { id: '11', name: 'Caesar Salad', quantity: 2 },
        { id: '12', name: 'Grilled Salmon', quantity: 1 }
      ],
      isUrgent: false
    }
  ]);

  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

const { user } = useAuth()

  if (!user) return null

  const navigate = useNavigate()
  const navigationItems = [
    {
      label: 'Service Dashboard',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/waiter")
    },
    {
      label: 'Served Today',
      icon: <Clock className="w-5 h-5" />,
      active: true
    }
  ];

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const stats = {
    toServe: orders.filter(o => o.status === 'ready').length,
    ready: orders.filter(o => o.status === 'ready').length,
    inProgress: orders.filter(o => o.status === 'preparing').length,
    completed: orders.filter(o => o.status === 'served').length
  };

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleMarkAsServed = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'served' as const }
        : order
    ));
    const order = orders.find(o => o.id === orderId);
    addToast(`${order?.tableNumber} marked as served`, 'success');
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Orders refreshed', 'info');
    }, 1000);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'served':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready to Serve';
      case 'served':
        return 'Served';
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'served');
  const servedOrders = orders.filter(o => o.status === 'served');

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-bold text-3xl text-slate-900 mb-2">Serve Today</h1>
            <p className="text-slate-600">Orders ready to be served or in progress</p>
            <p className="text-sm text-slate-500 mt-1">Today – {getCurrentDate()}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tables to Serve */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Tables to Serve</p>
                <p className="font-bold text-2xl text-slate-900">{stats.toServe}</p>
              </div>
            </div>
          </div>

          {/* Orders Ready */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Orders Ready</p>
                <p className="font-bold text-2xl text-slate-900">{stats.ready}</p>
              </div>
            </div>
          </div>

          {/* Orders In Progress */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Orders In Progress</p>
                <p className="font-bold text-2xl text-slate-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Completed Today</p>
                <p className="font-bold text-2xl text-slate-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="mb-8">
          <h2 className="font-bold text-xl text-slate-900 mb-4">Active Orders</h2>
          {activeOrders.length > 0 ? (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${
                    order.isUrgent
                      ? 'border-amber-400 shadow-lg shadow-amber-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Order Header */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{order.tableNumber}</h3>
                          <p className="text-sm text-slate-500">Order #{order.id}</p>
                        </div>
                        {order.isUrgent && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <AlertCircle className="w-3 h-3" />
                            Waiting long
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{order.timeSinceOrder} min ago</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <button
                      onClick={() => toggleOrderExpand(order.id)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors mb-4"
                    >
                      <span className="text-sm text-slate-700">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {/* Expanded Order Items */}
                    {expandedOrders.has(order.id) && (
                      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-slate-900">
                                  {item.quantity}x {item.name}
                                </p>
                                {item.notes && (
                                  <p className="text-sm text-slate-500 italic">Note: {item.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleMarkAsServed(order.id)}
                        disabled={order.status !== 'ready'}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        <Check className="w-5 h-5" />
                        Mark as Served
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">No orders to serve right now 🎉</h3>
              <p className="text-slate-600">All orders have been served. Great job!</p>
            </div>
          )}
        </div>

        {/* Completed Orders (Collapsible) */}
        {servedOrders.length > 0 && (
          <div>
            <h2 className="font-bold text-xl text-slate-900 mb-4">
              Completed Orders ({servedOrders.length})
            </h2>
            <div className="space-y-3">
              {servedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900">{order.tableNumber}</h4>
                        <p className="text-sm text-slate-500">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{order.items.length} items</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transition-all ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Loader className="w-5 h-5 animate-spin" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ServeTodayDashboard