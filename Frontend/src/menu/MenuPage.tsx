import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { DashboardLayout } from "../dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { listMenuItems, createOrder } from "../api/restaurant";

/* ---------------- Types ---------------- */

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  available: boolean;
  category: Category | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

/* ---------------- Component ---------------- */

const MenuPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "My Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      onClick: () => navigate("/dashboard/customer"),
    },
    {
      label: "Menu",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      active: true,
    },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- Load Menu ---------------- */

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await listMenuItems();

        const mapped: MenuItem[] = Array.isArray(data)
          ? data.map((it: any) => ({
              id: it.item_id,
              name: it.name,
              description: it.description,
              price:
                typeof it.price === "string"
                  ? parseFloat(it.price)
                  : it.price,
              image: it.image ?? null,
              available: it.available,
              category: it.category ?? null,
            }))
          : [];

        if (mounted) setMenuItems(mapped);
      } catch {
        if (mounted) setMenuError("Failed to load menu");
      } finally {
        if (mounted) setMenuLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- Categories (Dynamic) ---------------- */

  const categories = useMemo(() => {
    const map = new Map<number, Category>();
    menuItems.forEach((item) => {
      if (item.category) {
        map.set(item.category.id, item.category);
      }
    });
    return Array.from(map.values());
  }, [menuItems]);

  /* ---------------- Filters ---------------- */

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      item.category?.name === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /* ---------------- Cart Logic ---------------- */

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const getTotalPrice = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        items: cart.map((item) => ({
          menu_item: item.id,
          quantity: item.quantity,
          note: "",
        })),
      });
      setCart([]);
      navigate("/dashboard/customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <DashboardLayout user={user} navigationItems={navigationItems}>
      <div className="p-8 pb-24">
        <h1 className="font-bold text-3xl text-slate-900 mb-2">
          Menu
        </h1>
        <p className="text-slate-600 mb-6">
          Browse dishes and place your order
        </p>

        {/* Search */}
        <div className="relative w-full max-w-lg mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md text-slate-900"
          />
        </div>

        {/* Categories */}
        <div className="mb-8 border-b border-slate-200 flex gap-6">
          <button
            onClick={() => setActiveCategory("All")}
            className={`pb-3 ${
              activeCategory === "All"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-slate-600"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`pb-3 ${
                activeCategory === cat.name
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-slate-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* States */}
        {menuLoading && (
          <p className="text-slate-600">Loading menu...</p>
        )}
        {menuError && (
          <p className="text-red-500">{menuError}</p>
        )}

        {/* Menu Grid */}
        {!menuLoading && !menuError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col h-full"
          >
          
          {/* Image */}
          <div className="h-48 bg-slate-100">
            <img
              src={item.image ?? "/placeholder-food.jpg"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-lg mb-2 text-slate-900">
              {item.name}
            </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-3">
            {item.description}
          </p>

          {/* Bottom fixed section */}
          <div className="mt-auto">
            {/* Price */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-emerald-700">
                ${item.price.toFixed(2)}
              </span>

              {!item.available && (
                <span className="text-xs text-red-500">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Button */}
            <button
              onClick={() => addToCart(item)}
              disabled={!item.available}
              className="
                w-full bg-emerald-600 text-white py-2 rounded-lg
                hover:bg-emerald-700 transition-colors
                disabled:bg-slate-300 disabled:text-slate-600
              "
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

        {/* Cart Bar */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
            <span className="font-bold text-slate-900">
              Total: ${getTotalPrice().toFixed(2)}
            </span>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
